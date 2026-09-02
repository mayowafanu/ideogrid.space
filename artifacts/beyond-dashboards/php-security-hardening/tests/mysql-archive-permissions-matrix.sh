#!/usr/bin/env bash
#
# Run the archive permission regression against every immutable MariaDB image
# documented in the compatibility section of README.md.
#
# The containers receive only a read-only copy of this repository. The
# regression creates its datadir, socket, synthetic rows, temporary account,
# and evidence inside each disposable container.

set -Eeuo pipefail

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$TEST_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$TEST_DIR/../../../.." && pwd)"
README_FILE="$ROOT_DIR/README.md"
REGRESSION_SCRIPT="artifacts/beyond-dashboards/php-security-hardening/tests/mysql-archive-permissions.sh"

fail() {
    echo "FAIL: MariaDB compatibility matrix: $*" >&2
    exit 1
}

[[ -r "$README_FILE" ]] || fail "compatibility README is not readable: $README_FILE"
command -v docker >/dev/null 2>&1 \
    || fail "Docker is required to run the immutable compatibility images"

# Keep this allow-list explicit so the release gate cannot silently broaden or
# narrow the supported matrix when documentation is edited.
EXPECTED_PATCHES=("10.4.32" "10.11.19")
declare -A image_by_patch=()
compatibility_section=0
in_code_block=0

while IFS= read -r line; do
    if [[ "$line" == "### MariaDB compatibility target" ]]; then
        compatibility_section=1
        continue
    fi
    if (( compatibility_section )) && [[ "$line" == "### "* ]]; then
        break
    fi
    (( compatibility_section )) || continue

    if [[ "$line" == '```'* ]]; then
        if (( in_code_block )); then
            in_code_block=0
        else
            in_code_block=1
        fi
        continue
    fi

    if (( in_code_block )) && [[ "$line" =~ (mariadb:[^[:space:]]+) ]]; then
        image="${BASH_REMATCH[1]}"
        [[ "$image" =~ ^mariadb:([0-9]+\.[0-9]+\.[0-9]+)@sha256:[[:xdigit:]]{64}$ ]] \
            || fail "compatibility command uses a non-immutable MariaDB image '$image'"
        patch="${BASH_REMATCH[1]}"
        [[ -z "${image_by_patch[$patch]+set}" ]] \
            || fail "MariaDB $patch appears more than once in the compatibility commands"
        image_by_patch["$patch"]="$image"
    fi
done <"$README_FILE"

(( compatibility_section )) || fail "compatibility section is missing from $README_FILE"
(( in_code_block == 0 )) || fail "compatibility section has an unterminated code block"

# Run the offline guard before starting Docker. It ensures every command we
# extracted agrees with the immutable references in the compatibility table.
bash "$TEST_DIR/check-mariadb-image-pins.sh" "$README_FILE"

for patch in "${EXPECTED_PATCHES[@]}"; do
    [[ -n "${image_by_patch[$patch]+set}" ]] \
        || fail "MariaDB $patch is missing from the compatibility commands"
done

(( ${#image_by_patch[@]} == ${#EXPECTED_PATCHES[@]} )) \
    || fail "compatibility commands contain an unsupported MariaDB target"

MATRIX_WORKSPACE="$(mktemp -d "${TMPDIR:-/tmp}/security-audit-matrix-XXXXXX")"
cleanup() {
    rm -rf "$MATRIX_WORKSPACE"
}
trap cleanup EXIT INT TERM

for patch in "${EXPECTED_PATCHES[@]}"; do
    image="${image_by_patch[$patch]}"
    output_file="$MATRIX_WORKSPACE/mariadb-$patch.log"

    echo "Running MariaDB compatibility target: $patch ($image)"
    set +e
    docker run --rm --user mysql \
        -v "$PROJECT_ROOT:/workspace:ro" -w /workspace \
        "$image" \
        bash "$REGRESSION_SCRIPT" >"$output_file" 2>&1
    status=$?
    set -e

    if (( status != 0 )); then
        echo "FAIL: MariaDB compatibility target $patch ($image) failed (exit status $status)" >&2
        cat "$output_file" >&2
        exit "$status"
    fi

    cat "$output_file"
    echo "MariaDB compatibility target $patch passed."
done

echo "MariaDB archive permission compatibility matrix passed: ${EXPECTED_PATCHES[*]}"