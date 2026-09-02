#!/usr/bin/env bash
#
# Disposable MariaDB-compatible permission and retention regression test.
#
# This test creates a private datadir and socket, uses only synthetic rows, and
# removes the server and all temporary files on exit. It never reads the
# application's config or connects to a production database.

set -Eeuo pipefail

echo 'Intentional merge-gate failure probe' >&2
exit 1

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="$ROOT_DIR/database/security_audit.sql"

# Keep compatibility evidence immutable even when MariaDB tooling is absent.
bash "$ROOT_DIR/tests/check-mariadb-image-pins.sh" "$ROOT_DIR/README.md"

MISSING_TOOLS=()
for tool in mariadbd mariadb-install-db mariadb; do
    if ! command -v "$tool" >/dev/null 2>&1; then
        MISSING_TOOLS+=("$tool")
    fi
done

if (( ${#MISSING_TOOLS[@]} > 0 )); then
    echo "FAIL: archive permission release gate cannot run; missing MariaDB tooling: ${MISSING_TOOLS[*]}" >&2
    echo "Install the MariaDB package before running this validation. Missing tooling is not treated as a passing skip." >&2
    exit 1
fi

WORKSPACE="$(mktemp -d "${TMPDIR:-/tmp}/security-audit-mysql-XXXXXX")"
DATADIR="$WORKSPACE/data"
SOCKET="$WORKSPACE/mariadb.sock"
PIDFILE="$WORKSPACE/mariadb.pid"
ERROR_LOG="$WORKSPACE/mariadb-error.log"
CLIENT_HOME="$WORKSPACE/client-home"
SERVER_PID=""
DB_NAME="audit_permission_${$}"
LIMITED_USER="audit_limited_${$}"
LIMITED_PASSWORD="audit-test-${$}-not-production"
APPROVAL_REFERENCE="PERMISSION-REGRESSION-${$}"

cleanup() {
    set +e
    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
        kill "$SERVER_PID" 2>/dev/null
        wait "$SERVER_PID" 2>/dev/null
    fi
    rm -rf "$WORKSPACE"
}
trap cleanup EXIT INT TERM

mkdir -p "$CLIENT_HOME"

client() {
    HOME="$CLIENT_HOME" mariadb \
        --no-defaults \
        --protocol=SOCKET \
        --socket="$SOCKET" \
        "$@"
}

root_client() {
    client --user=root "$@"
}

limited_client() {
    MYSQL_PWD="$LIMITED_PASSWORD" client --user="$LIMITED_USER" "$@"
}

query_limited() {
    limited_client "$DB_NAME" --batch --skip-column-names --raw -e "$1"
}

fail() {
    echo "FAIL: $*" >&2
    exit 1
}

assert_eq() {
    local expected="$1"
    local actual="$2"
    local label="$3"
    [[ "$expected" == "$actual" ]] || fail "$label (expected '$expected', got '$actual')"
}

assert_gt() {
    local left="$1"
    local right="$2"
    local label="$3"
    (( left > right )) || fail "$label (expected $left > $right)"
}

expect_denied() {
    local sql="$1"
    local label="$2"
    local output="$WORKSPACE/denied-${RANDOM}.out"
    if limited_client "$DB_NAME" --batch --skip-column-names -e "$sql" >"$output" 2>&1; then
        cat "$output" >&2
        fail "$label"
    fi
}

echo "Starting disposable MariaDB permission regression..."

mariadb-install-db \
    --no-defaults \
    --datadir="$DATADIR" \
    --auth-root-authentication-method=normal \
    --skip-test-db \
    --user="$(id -un)" \
    >"$WORKSPACE/install.out" 2>&1

mariadbd \
    --no-defaults \
    --datadir="$DATADIR" \
    --socket="$SOCKET" \
    --pid-file="$PIDFILE" \
    --log-error="$ERROR_LOG" \
    --skip-networking \
    --user="$(id -un)" \
    >"$WORKSPACE/server.out" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 60); do
    if root_client --batch --skip-column-names -e 'SELECT 1' >/dev/null 2>&1; then
        break
    fi
    sleep 0.1
done
root_client --batch --skip-column-names -e 'SELECT 1' >/dev/null \
    || { cat "$ERROR_LOG" >&2; fail "MariaDB did not start"; }

SERVER_VERSION="$(root_client --batch --skip-column-names --raw -e 'SELECT VERSION()')"
echo "MariaDB server: $SERVER_VERSION"

root_client -e "CREATE DATABASE \`$DB_NAME\`"
root_client "$DB_NAME" <"$SQL_FILE"

root_client -e "
    CREATE USER '$LIMITED_USER'@'localhost' IDENTIFIED BY '$LIMITED_PASSWORD';
    GRANT SELECT, INSERT ON \`$DB_NAME\`.\`security_audit_log\`
      TO '$LIMITED_USER'@'localhost';
    GRANT SELECT ON \`$DB_NAME\`.\`security_audit_archive\`
      TO '$LIMITED_USER'@'localhost';
    GRANT EXECUTE ON PROCEDURE \`$DB_NAME\`.\`archive_security_audit\`
      TO '$LIMITED_USER'@'localhost';
    FLUSH PRIVILEGES;
"

limited_client "$DB_NAME" <<SQL
INSERT INTO security_audit_log
    (event_name, actor_id, actor_role, request_id, ip_address, http_method,
     route, term_name, session_name, context_json, created_at)
VALUES
    ('old_signal', 42, 'teacher', 'permission-test-1', '192.0.2.10', 'POST',
     '/decision-center', 'First Term', '2026/2027',
     JSON_OBJECT('student_id', 201, 'class_id', 10, 'reason', 'class-mismatch'),
     DATE_SUB(UTC_TIMESTAMP(6), INTERVAL 367 DAY)),
    ('old_intervention', 42, 'teacher', 'permission-test-2', '192.0.2.10', 'POST',
     '/li/interventions/track.php', 'First Term', '2026/2027',
     JSON_OBJECT('intervention_id', 7, 'student_id', 201, 'reason', 'membership-mismatch'),
     DATE_SUB(UTC_TIMESTAMP(6), INTERVAL 368 DAY)),
    ('live_sentinel', 42, 'teacher', 'permission-test-3', '192.0.2.10', 'POST',
     '/decision-center', 'First Term', '2026/2027',
     JSON_OBJECT('student_id', 202, 'class_id', 10, 'reason', 'still-live'),
     UTC_TIMESTAMP(6));
SQL

RECENT_CUTOFF="$(query_limited "SELECT DATE_FORMAT(DATE_SUB(UTC_TIMESTAMP(), INTERVAL 364 DAY), '%Y-%m-%d %H:%i:%s')")"
expect_denied \
    "CALL \`$DB_NAME\`.archive_security_audit('$RECENT_CUTOFF', '$APPROVAL_REFERENCE')" \
    "a cutoff newer than 365 days was accepted"
expect_denied \
    "CALL \`$DB_NAME\`.archive_security_audit(DATE_SUB(UTC_TIMESTAMP(), INTERVAL 366 DAY), '')" \
    "an empty approval reference was accepted"

CUTOFF="$(query_limited "SELECT DATE_FORMAT(DATE_SUB(UTC_TIMESTAMP(), INTERVAL 366 DAY), '%Y-%m-%d %H:%i:%s')")"
CALL_RESULT="$(limited_client "$DB_NAME" --batch --skip-column-names --raw -e \
    "CALL \`$DB_NAME\`.archive_security_audit('$CUTOFF', '$APPROVAL_REFERENCE')")"
BATCH_ID="$(printf '%s\n' "$CALL_RESULT" | tail -n 1 | awk '{print $1}')"
ARCHIVED_COUNT="$(printf '%s\n' "$CALL_RESULT" | tail -n 1 | awk '{print $2}')"
[[ "$BATCH_ID" == audit-archive-* ]] || fail "limited account did not execute archive procedure"
assert_eq "2" "$ARCHIVED_COUNT" "archive procedure returned archived count"

assert_eq "2" "$(query_limited "SELECT COUNT(*) FROM security_audit_archive WHERE archive_batch_id = '$BATCH_ID'")" \
    "successful batch row count"
assert_eq "2" "$(query_limited "SELECT COUNT(*) FROM security_audit_archive WHERE archive_batch_id = '$BATCH_ID' AND created_at < '$CUTOFF'")" \
    "only pre-cutoff events were archived"
assert_eq "1" "$(query_limited "SELECT COUNT(*) FROM security_audit_log")" \
    "live sentinel remains after archive"
assert_eq "0" "$(query_limited "SELECT COUNT(*) FROM security_audit_log WHERE created_at < '$CUTOFF'")" \
    "eligible live rows were removed"
assert_eq "2" "$(query_limited "SELECT COUNT(*) FROM security_audit_archive WHERE archive_batch_id = '$BATCH_ID' AND JSON_VALID(context_json) = 1")" \
    "JSON context remains valid"
assert_eq "2" "$(query_limited "SELECT COUNT(*) FROM security_audit_archive WHERE archive_batch_id = '$BATCH_ID' AND JSON_UNQUOTE(JSON_EXTRACT(context_json, '$.student_id')) IN ('201')")" \
    "JSON context values survive archive"
assert_eq "2" "$(query_limited "SELECT COUNT(*) FROM security_audit_archive WHERE archive_batch_id = '$BATCH_ID' AND archived_at > created_at")" \
    "archive timestamps are after event timestamps"
assert_gt "$(query_limited "SELECT COUNT(DISTINCT archive_batch_id) FROM security_audit_archive WHERE approval_reference = '$APPROVAL_REFERENCE'")" "0" \
    "approval reference is recorded"

expect_denied \
    "UPDATE \`$DB_NAME\`.security_audit_archive SET event_name = 'tampered' WHERE id = 1" \
    "limited account could update archive rows"
expect_denied \
    "DELETE FROM \`$DB_NAME\`.security_audit_archive WHERE id = 1" \
    "limited account could delete archive rows"
expect_denied \
    "UPDATE \`$DB_NAME\`.security_audit_log SET event_name = 'tampered' WHERE id = 3" \
    "limited account could update live audit rows"
expect_denied \
    "DELETE FROM \`$DB_NAME\`.security_audit_log WHERE id = 3" \
    "limited account could delete live audit rows"

# Force the procedure's archive INSERT to fail on a duplicate archive ID.
# Its transaction handler must preserve the new live row and archive count.
limited_client "$DB_NAME" -e "
    INSERT INTO security_audit_log
        (event_name, actor_id, actor_role, request_id, context_json, created_at)
    VALUES
        ('atomicity_sentinel', 42, 'teacher', 'permission-test-4',
         JSON_OBJECT('atomicity', TRUE),
         DATE_SUB(UTC_TIMESTAMP(6), INTERVAL 367 DAY));
"
root_client "$DB_NAME" -e "
    INSERT INTO security_audit_archive
        (id, event_name, actor_id, actor_role, request_id, context_json,
         created_at, archived_at, archive_batch_id, approval_reference)
    SELECT id, 'preexisting_archive_id', actor_id, actor_role, request_id,
           context_json, created_at, UTC_TIMESTAMP(6), 'atomicity-fixture',
           'ATOMICITY-FIXTURE'
      FROM security_audit_log
     WHERE event_name = 'atomicity_sentinel';
"
ARCHIVE_COUNT_BEFORE="$(query_limited "SELECT COUNT(*) FROM security_audit_archive")"
expect_denied \
    "CALL \`$DB_NAME\`.archive_security_audit(DATE_SUB(UTC_TIMESTAMP(), INTERVAL 366 DAY), 'ATOMICITY-FAILURE')" \
    "archive procedure did not fail on duplicate archive ID"
assert_eq "$ARCHIVE_COUNT_BEFORE" "$(query_limited "SELECT COUNT(*) FROM security_audit_archive")" \
    "failed archive did not partially insert rows"
assert_eq "1" "$(query_limited "SELECT COUNT(*) FROM security_audit_log WHERE event_name = 'atomicity_sentinel'")" \
    "failed archive did not remove the live row"

echo "MariaDB archive permission regression passed."
echo "  limited procedure execution: yes"
echo "  archive UPDATE/DELETE denied: yes"
echo "  365-day cutoff, approval, JSON, timestamp, and atomicity checks: yes"