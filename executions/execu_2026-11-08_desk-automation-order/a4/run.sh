#!/usr/bin/env bash
# Usage: a4/run.sh <script.js> [account] — prepends a4/lib.js and runs it with scripts/api.js (default account ndc-staging-owner).
D="$(cd "$(dirname "$0")" && pwd)"; S="$D/../scripts"; F="$S/.a4-$(basename "$1")"
cat "$D/lib.js" "$D/$1" > "$F"; (cd "$S" && node api.js "${2:-ndc-staging-owner}" "$(basename "$F")"); rm -f "$F"
