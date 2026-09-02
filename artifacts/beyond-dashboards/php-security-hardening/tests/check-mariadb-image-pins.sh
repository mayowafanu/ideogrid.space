#!/usr/bin/env bash
#
# Offline guard for the MariaDB compatibility image references documented in
# README.md. This intentionally does not invoke Docker, MariaDB, or any
# application configuration.

set -Eeuo pipefail

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
README_FILE="${1:-"$TEST_DIR/../README.md"}"

fail() {
    echo "FAIL: $*" >&2
    exit 1
}

[[ -r "$README_FILE" ]] || fail "MariaDB compatibility README is not readable: $README_FILE"

declare -A table_reference_by_patch=()
declare -A table_patch_by_digest=()
table_count=0

table_row_re='^[[:space:]]*\|[[:space:]]*([0-9]+\.[0-9]+\.[0-9]+)[[:space:]]*\|[[:space:]]*`(mariadb:[^`]+)`[[:space:]]*\|'
image_reference_re='^mariadb:([0-9]+\.[0-9]+\.[0-9]+)@sha256:([[:xdigit:]]{64})$'

while IFS= read -r line; do
    if [[ "$line" =~ $table_row_re ]]; then
        patch="${BASH_REMATCH[1]}"
        reference="${BASH_REMATCH[2]}"
        [[ "$reference" =~ $image_reference_re ]] \
            || fail "table entry for MariaDB $patch is not a tag plus a 64-character sha256 digest"

        image_patch="${BASH_REMATCH[1]}"
        digest="${BASH_REMATCH[2],,}"
        [[ "$patch" == "$image_patch" ]] \
            || fail "table entry pairs patch $patch with tag $image_patch"
        [[ -z "${table_reference_by_patch[$patch]+set}" ]] \
            || fail "MariaDB patch $patch is documented more than once"
        [[ -z "${table_patch_by_digest[$digest]+set}" ]] \
            || fail "digest is paired with more than one documented patch"

        table_reference_by_patch["$patch"]="$reference"
        table_patch_by_digest["$digest"]="$patch"
        ((table_count += 1))
    fi
done <"$README_FILE"

(( table_count > 0 )) || fail "MariaDB compatibility table is missing"

compatibility_section=0
in_code_block=0
command_references=()

# Capture any tag so that non-version tags such as `latest` fail the immutable
# reference check instead of being ignored.
command_reference_re='mariadb:[^[:space:]]+'
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

    if (( in_code_block )) && [[ "$line" =~ $command_reference_re ]]; then
        command_references+=("${BASH_REMATCH[0]}")
    fi
done <"$README_FILE"

(( compatibility_section )) || fail "MariaDB compatibility section is missing"
(( in_code_block == 0 )) || fail "MariaDB compatibility section has an unterminated code block"
(( ${#command_references[@]} > 0 )) || fail "MariaDB compatibility Docker commands are missing"

declare -A command_count_by_patch=()
for reference in "${command_references[@]}"; do
    [[ "$reference" =~ $image_reference_re ]] \
        || fail "compatibility command uses mutable MariaDB image reference '$reference'; add @sha256:<digest>"

    patch="${BASH_REMATCH[1]}"
    digest="${BASH_REMATCH[2],,}"
    [[ -n "${table_reference_by_patch[$patch]+set}" ]] \
        || fail "compatibility command uses undocumented MariaDB patch $patch"
    [[ "${table_reference_by_patch[$patch]}" == "$reference" ]] \
        || fail "compatibility command for MariaDB $patch does not match its documented digest"
    [[ -n "${table_patch_by_digest[$digest]+set}" ]] \
        || fail "compatibility command for MariaDB $patch uses an undocumented digest"
    [[ "${table_patch_by_digest[$digest]}" == "$patch" ]] \
        || fail "compatibility digest is not paired with its human-readable patch $patch"

    ((command_count_by_patch["$patch"] += 1))
done

for patch in "${!table_reference_by_patch[@]}"; do
    [[ "${command_count_by_patch[$patch]:-0}" == "1" ]] \
        || fail "documented MariaDB $patch must appear in exactly one compatibility command"
done

echo "MariaDB image pin check passed (table and compatibility commands agree)."