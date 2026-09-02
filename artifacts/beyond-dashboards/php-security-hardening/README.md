# PHP security hardening kit

This directory is a safe, source-level patch kit for the uploaded
`ideogridspace` PHP application. The PHP application is an uploaded archive,
not the running codebase for this Beyond Dashboards artifact, so the kit keeps
the hardening changes reviewable and portable instead of silently replacing
the original upload.

## What this fixes

- Resolves admin, class-teacher, subject-teacher, and student identity from
  the session and current-term assignments.
- Re-checks the canonical learner class and subject/class assignment before a
  result write.
- Converts result deletion to a POST-only, CSRF-protected operation that
  locks and checks every row before deleting it.
- Re-checks intervention and intervention-student membership on every write.
- Rejects edits and deletes of historical intervention sessions. Corrections
  must be appended as new observations or correction events.
- Persists structured security-audit events for rejected authentication, CSRF,
  result-scope, and intervention-scope requests in an append-only table.
- Includes an administrator-only audit view with bounded pagination, event
  filtering, and sanitized request context.
- Validates scores and dates at the server boundary.

## Install

1. Copy `includes/security.php` into the PHP application's `includes/`
   directory.
2. Include it immediately after `includes/config.php` in:
   - `summative.php`
   - `li/interventions/shared/auth.php`
   - `li/interventions/track.php`
   - `li/interventions/outcomes.php`
   - result and assessment AJAX write handlers.
3. In each HTML form, add `<?php echo app_security_csrf_field(); ?>`.
4. At the first line of each POST handler, call:

   ```php
   app_security_require_csrf(true);
   ```

5. Build the context once per request:

   ```php
   $securityContext = app_security_context($dbh, $admint, $admins);
   ```

6. Replace posted-ID authorization with the helper checks described below.

## Summative results

### Add or bulk update

Never trust `class`, `studentid`, `subject`, `term`, or `year` because they
came from a form. After loading each canonical row, call:

```php
app_security_require_result_scope(
    $dbh,
    $securityContext,
    (int)$studentId,
    (int)$classId,
    (int)$subjectId,
    $term,
    $year,
    false
);

$exam = app_security_score($exam, 'Exam mark');
$ca = app_security_score($ca, 'Continuous assessment mark');
```

For bulk requests, perform this inside the student loop. If one row fails,
roll back the whole transaction; do not save the other rows.

### Delete

Remove the GET-style branch:

```php
if (isset($_GET['del']) && isset($_GET['term']) && isset($_GET['session'])) {
```

Replace it with a POST-only handler. The helper locks and checks every result
row, preventing a teacher from deleting another class's result by changing a
student ID in the URL:

```php
if ($_SERVER['REQUEST_METHOD'] === 'POST'
    && ($_POST['action'] ?? '') === 'delete_results') {
    app_security_require_csrf(false);

    $studentId = filter_input(INPUT_POST, 'student_id', FILTER_VALIDATE_INT);
    $term = (string)($_POST['term'] ?? '');
    $session = (string)($_POST['session'] ?? '');
    if (!$studentId || $term === '' || $session === '') {
        throw new InvalidArgumentException('A learner and period are required.');
    }

    $dbh->beginTransaction();
    try {
        $ids = app_security_result_ids_for_delete(
            $dbh,
            $securityContext,
            $studentId,
            $term,
            $session
        );

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $delete = $dbh->prepare("DELETE FROM tblresult WHERE id IN ($placeholders)");
        $delete->execute($ids);
        $dbh->commit();

        app_security_audit('results_deleted', [
            'student_id' => $studentId,
            'term' => $term,
            'session' => $session,
            'result_count' => count($ids),
        ]);
    } catch (Throwable $e) {
        if ($dbh->inTransaction()) {
            $dbh->rollBack();
        }
        app_security_audit('results_delete_failed', [
            'student_id' => $studentId,
            'reason' => $e->getMessage(),
        ]);
        throw $e;
    }
}
```

The manage-table control should be a form with a visible confirmation, not an
anchor:

```php
<form method="post" onsubmit="return confirm('Delete this learner’s results for this period?');">
    <?php echo app_security_csrf_field(); ?>
    <input type="hidden" name="action" value="delete_results">
    <input type="hidden" name="student_id" value="<?php echo (int)$row['StudentId']; ?>">
    <input type="hidden" name="term" value="<?php echo htmlspecialchars($row['term'], ENT_QUOTES); ?>">
    <input type="hidden" name="session" value="<?php echo htmlspecialchars($row['year'], ENT_QUOTES); ?>">
    <button type="submit">Delete</button>
</form>
```

## Intervention pages

The shared intervention auth file should return the centralized context:

```php
require_once __DIR__ . '/../../../includes/config.php';
require_once __DIR__ . '/../../../includes/security.php';

$admint = $adminresult->term ?? 'First Term';
$admins = $adminresult->session ?? '2025/2026';
$securityContext = app_security_context($dbh, $admint, $admins);

if (($securityContext['role'] ?? null) === 'student'
    && strpos($_SERVER['SCRIPT_NAME'], '/li/interventions/student/') === false) {
    header('Location: student/index.php');
    exit();
}

return [
    'userRole' => $securityContext['role'],
    'userId' => $securityContext['user_id'],
    'admint' => $admint,
    'admins' => $admins,
    'isClassTeacher' => !empty($securityContext['class_ids']),
    'isSubjectTeacher' => !empty($securityContext['subject_class_pairs']),
    'taughtClasses' => $securityContext['class_ids'],
    'taughtSubjects' => $securityContext['subject_ids'],
    'securityContext' => $securityContext,
    'dbh' => $dbh,
    'dbh2' => $dbh2,
];
```

At the top of `track.php` and `outcomes.php`, after parsing the intervention
ID, use:

```php
$intervention = app_security_require_intervention(
    $dbh,
    $dbh2,
    $securityContext,
    $interventionId,
    $admint,
    $admins,
    false,
    false
);
```

At the top of every AJAX write:

```php
app_security_require_csrf(true);
$studentId = filter_input(INPUT_POST, 'student_id', FILTER_VALIDATE_INT);
app_security_require_intervention_student(
    $dbh,
    $dbh2,
    $securityContext,
    $interventionId,
    (int)$studentId,
    $admint,
    $admins,
    true
);
```

Validate scores and dates before writing:

```php
$score = app_security_score($_POST['current_score'] ?? null, 'Current score');
$sessionDate = app_security_date(
    (string)($_POST['session_date'] ?? date('Y-m-d')),
    'Session date'
);
```

`complete_intervention` and `close_intervention` must call
`app_security_require_intervention(..., true, ...)` as well. Do not authorize
them only by comparing `responsible_staff_id` to a posted or stale user value.

## Historical observations

Remove `edit_session` and `delete_session` from `track.php`. They currently
rewrite the JSON score history and delete matching timeline rows. That makes
the evidence trail non-auditable.

- To correct a score, append a new observation with the reason for correction.
- Add a timeline event such as `Session correction recorded` with the actor,
  original session number, corrected value, and reason.
- Never delete or mutate the original timeline event.
- Keep the original observation visible in the history view.

The existing `update_student` action is the safe starting point because it
appends a new score and a new timeline event. It still needs the scope, CSRF,
and input checks above.

## Assessment AJAX writes

Apply the same boundary rules to:

- `ajax/save-assessment.php`
- `ajax/delete-assessment.php`
- `ajax/bulk-grade.php`
- `ajax/update-result-status.php`
- `li/assessments/edit.php`
- `li/assessments/bulk-grade.php`

Every assessment read used for a write must include the current term/session
and the canonical class/subject. A teacher may only edit or grade an
assessment they created or one whose class/subject assignment is in their
centralized context. Deletion must be POST-only, CSRF-protected, and limited
to draft assessments.

## Durable audit trail

Run `database/security_audit.sql` once against the primary
`ideonbod_prs` database. The uploaded schema confirms that this is the
database behind `includes/config.php` and the `$dbh` connection. The migration
creates `security_audit_log` without actor foreign keys so history survives
account cleanup, adds indexes for administrator review, and blocks update and
delete operations with database triggers.

The helper automatically uses the application's `$dbh` connection. If the
connection has another variable name, call this once after including the
helper:

```php
app_security_configure_audit($dbh);
```

The normal sink is the audit table. If the table or database is temporarily
unavailable, the write is still rejected and a rate-limited operational alert
is emitted. By default that alert is the fixed
`[security-audit-alert] persistence_unavailable` log signal, which can be
collected by the host's monitoring system. Deployments can provide a
secret-free callback as the second argument to
`app_security_configure_audit($dbh, $alertHandler)`. The fallback never
contains passwords, tokens, cookies, CSRF values, exception text, or raw
request bodies.

## Administrator audit view

Copy `security-audit.php` to the application root after running the migration.
It verifies the current session through the shared context and exits unless
the actor is an administrator. Add a link to it from the existing admin
navigation if desired:

```text
/security-audit.php
```

The page displays the event, actor, IP, method, route without query strings,
request ID, period, and sanitized JSON scope context. It does not display
passwords, tokens, cookies, or request bodies.

The page also checks audit storage health and shows the total stored events
and timestamp of the last successful write. It shows the active retained date
range, archive count, and latest archive timestamp. If the table cannot be
read, it shows an unavailable state and emits the same rate-limited operational
alert. The web page exposes no purge or archive button.

## Retention and archive process

The default policy retains events in `security_audit_log` for **365 days**.
This is a conservative baseline for school security investigations; adjust it
only through a documented privacy/legal review. Events older than that window
may be moved atomically into `security_audit_archive`, which is also
append-only and keeps the original event ID, archive batch ID, and approval
reference.

Archiving is intentionally a separate, CLI-only administrator workflow:

```bash
# Review first; this does not mutate either table.
php tools/archive-security-audit.php \
  --before=2025-01-01 \
  --approval-reference=SECURITY-REVIEW-2026-09 \
  --dry-run

# Execute only after the retention review is approved.
# --evidence is a metadata-only SHA-256 batch manifest. Keep it with the
# incident record; it does not contain event context.
php tools/archive-security-audit.php \
  --before=2025-01-01 \
  --approval-reference=SECURITY-REVIEW-2026-09 \
  --evidence=/secure/audit/2026-09-evidence.json \
  --export=/secure/audit/2026-09-archive.json \
  --confirm=ARCHIVE
```

The date must be at least 365 days old, an approval reference is mandatory,
and the explicit confirmation and evidence path are required for an executed
archive. The stored procedure performs the archive and live-table removal in
one transaction. After the procedure returns, the CLI reads the rows for that
batch in primary-key order and records a deterministic SHA-256 checksum in the
metadata-only evidence file. The optional export contains the rows needed for
an isolated restore drill and is written with mode `0600`; it should only be
stored in an access-controlled incident-response location.

### Archive restore drill

Run the disposable drill against the export before relying on archived
evidence in an incident:

```bash
php tools/restore-security-audit.php \
  --input=/secure/audit/2026-09-archive.json \
  --evidence=/secure/audit/2026-09-restore-evidence.json
```

The drill is CLI-only and never loads `includes/config.php`, opens the
application database, or needs a password, token, or other secret. It checks
the export checksum before importing rows into a fresh in-memory SQLite
database. It then verifies every archive row, original event ID, archive batch
ID, approval reference, and decoded context JSON; compares the restored
checksum; and records the result. Append-only triggers reject both update and
delete attempts against the restored archive. A live sentinel row is counted
before and after import, and archived IDs are checked for duplicate live
events. A successful result has unchanged live counts, zero duplicate live
events, an immutable archive, and a SHA-256 checksum in the restore evidence
file.

For a safe fixture-only smoke test (no export from an application database is
needed), run:

```bash
php tools/restore-security-audit.php
```

Do not restore directly into `security_audit_log` and do not use the live
application connection for inspection. Preserve the two evidence files and
the approval reference with the incident record, restrict their filesystem
permissions, and use the restored archive only for read-only investigation.
Do not grant ordinary web application users `UPDATE`, `DELETE`, or `EXECUTE`
on the audit tables or retention procedure; they need only the application
permissions required for normal event inserts and administrator review. The
migration's triggers provide a second protection layer, and the live table's
delete trigger only permits the controlled retention procedure.

## Post-install check

Run the included guard after applying the integration edits:

```bash
php tools/check-integration.php /path/to/ideogridspace
```

It checks that the high-risk handlers contain the shared security boundary and
that the old GET result deletion and in-place intervention history mutation
patterns are gone. It is intentionally a focused regression check, not a
replacement for authenticated integration tests.

## Regression tests

The fixture-backed regression suite exercises the shared guards with a fresh
in-memory SQLite database. It never reads or writes the production database:

```bash
php tests/security-regression.php
```

The suite covers admin, class-teacher, subject-teacher, student, and anonymous
contexts; add, bulk update, delete, assessment grading, intervention tracking,
and close-out writes; POST-only and CSRF failures; canonical class/subject
checks; intervention membership; append-only timeline history; and the
disposable archive export/import restore drill, including checksum, immutable
archive, context preservation, and no-duplicate-live-event checks.

After installing the kit into an application checkout, run the same suite with
the application root to add the source-level integration gate:

```bash
php tests/security-regression.php --app-root /path/to/ideogridspace
```

That second command deliberately fails until every listed handler has been
integrated with the shared guards.

For the database-specific retention boundary, run the disposable
MySQL-compatible check:

```bash
bash tests/mysql-archive-permissions.sh
```

It starts a socket-only MariaDB server in a temporary datadir, applies the
actual `database/security_audit.sql` migration, creates a limited synthetic
test account, and removes the server and all rows on exit. The account can
insert/read audit data and execute the definer procedure, but archive and live
`UPDATE`/`DELETE` operations are denied. The check also verifies the 365-day
cutoff, required approval reference, JSON context, archive timestamp ordering,
and transaction rollback when an archive insert fails. It never loads
`includes/config.php`, uses production credentials, or writes exported row
data into the repository. A missing MariaDB tool is an explicit failure, not a
skipped or passing check.

### Release validation gate

The workspace's named `archive-permissions` validation runs the compatibility
matrix from the repository root:

```bash
bash artifacts/beyond-dashboards/php-security-hardening/tests/mysql-archive-permissions-matrix.sh
```

The matrix first runs the offline image-pin guard, then runs the full
archive-permission regression once for MariaDB 10.4.32 and once for MariaDB
10.11.19. A nonzero result blocks the release, including permission
mismatches, an accepted operation that should be denied, archive
transaction/atomicity regressions, MariaDB startup failures, missing MariaDB
tooling, or a failure to start either compatibility image. The validation log
identifies the failed compatibility target and contains status and diagnostic
messages only. Do not attach credentials, synthetic row exports, or database
contents to the release result.

CI publishes the `MariaDB archive permissions matrix` check for every pull
request so a repository-wide required status check never remains pending when
unrelated files change. The full matrix runs when a pull request or push
changes the audit migration, this README, the MariaDB image-pin guard, either
MariaDB archive-permission regression script, or the workflow itself. For
other pull requests, the same named check records an out-of-scope success
without starting MariaDB. A nonzero matrix result blocks the check, and the
output identifies the affected MariaDB patch. The job publishes only pass/fail
status, target identity, and diagnostic messages; it does not upload
credentials, synthetic row exports, or database contents.

Deleting or renaming a protected input is also in scope. The detector disables
Git rename collapsing so a rename away from a protected path is evaluated as
the old path's deletion plus the new path's addition; the deletion keeps the
matrix selected and prevents removal of the migration or regression guard from
receiving an out-of-scope success.

### Repository merge policy

The default branch is `main`. Repository administrators must protect it with
the exact required status check **`MariaDB archive permissions matrix`**. This
is the job name in `.github/workflows/mariadb-compatibility.yml`; do not use
the workflow name (`MariaDB compatibility`) or the job ID
(`archive-permissions`) as a substitute.

For a pull request that changes the audit migration, this document, the
MariaDB image-pin guard, or either MariaDB archive-permission regression
script, the required check is merge-blocking until **both** pinned targets
(MariaDB 10.4.32 and 10.11.19) pass. A failed target, MariaDB startup failure,
missing MariaDB tooling, permission mismatch, archive atomicity regression, or
image-pin failure is a failed check and must not be bypassed. Re-run or correct
the change, then wait for a successful matrix result before merging.

The rule must be configured in the repository's GitHub branch-protection
settings (or an equivalent ruleset) for `main`; this README records the
policy, while GitHub supplies the enforcement. Keep the required check name
stable when changing the workflow, or update branch protection in the same
change. Do not restore pull-request path filters at the workflow trigger:
every pull request must publish the required check, while the workflow's
change-detection step decides whether to run the full matrix.

The release gate also runs this offline documentation check before starting
MariaDB. To run that guard by itself:

```bash
bash artifacts/beyond-dashboards/php-security-hardening/tests/check-mariadb-image-pins.sh
```

It fails if a compatibility command drops its `@sha256:` digest, if a digest
does not have a matching human-readable patch label in the compatibility table,
or if the table and commands document different immutable references. It reads
only the README and never contacts a database, Docker, or an application
configuration.

To run the complete compatibility matrix manually:

```bash
bash artifacts/beyond-dashboards/php-security-hardening/tests/mysql-archive-permissions-matrix.sh
```

### MariaDB compatibility target

The supported compatibility target for this kit is the MariaDB 10.4 LTS line
used by the application export and the MariaDB 10.11 LTS line used by the
current Replit validation environment. The application export identifies its
server as MariaDB 10.4.32. The compatibility checks use these pinned image
references:

| MariaDB patch | Immutable image reference |
| --- | --- |
| 10.4.32 | `mariadb:10.4.32@sha256:ee75c0457ab19e1b0a28516fad8066f8dafaac0421b1f05f8852b5c7a819b629` |
| 10.11.19 | `mariadb:10.11.19@sha256:ce66c7be32a03aabe7241d0a10993a2db827ef652a35d25727d92a832ac8ef73` |

The tag before `@` is the human-readable patch label; Docker uses the digest
after `@` to select the image, so a tag moving to another patch cannot change
the check implicitly. Updating a patch version requires intentionally
selecting and documenting a new digest and patch label together in this table,
the commands below, and the validation evidence. Run the same disposable
check against both clean images when validating a server upgrade:

```bash
docker run --rm --user mysql \
  -v "$PWD:/workspace:ro" -w /workspace \
  mariadb:10.4.32@sha256:ee75c0457ab19e1b0a28516fad8066f8dafaac0421b1f05f8852b5c7a819b629 \
  bash artifacts/beyond-dashboards/php-security-hardening/tests/mysql-archive-permissions.sh

docker run --rm --user mysql \
  -v "$PWD:/workspace:ro" -w /workspace \
  mariadb:10.11.19@sha256:ce66c7be32a03aabe7241d0a10993a2db827ef652a35d25727d92a832ac8ef73 \
  bash artifacts/beyond-dashboards/php-security-hardening/tests/mysql-archive-permissions.sh
```

On 2026-09-02, both compatibility targets passed the complete check:

| Target | Permission denials | Definer procedure | Archive rollback |
| --- | --- | --- | --- |
| MariaDB 10.4.32 (10.4 LTS line) | passed | passed | passed |
| MariaDB 10.11.19 (10.11 LTS line) | passed | passed | passed |

The test prints the server version as metadata, and its remaining output is
status only. Each run uses a temporary socket-only server, synthetic rows, and
temporary credentials; cleanup removes the datadir and credentials. Do not
include credentials, row exports, or database contents in compatibility
evidence. A failure on either target blocks an upgrade until the migration or
test is corrected.
