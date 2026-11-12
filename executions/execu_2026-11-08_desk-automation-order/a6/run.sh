#!/usr/bin/env bash
# Usage: a6/run.sh <script.js> [account]  — prepends a6/lib-bp.js, runs on NDC-Staging via scripts/api.js (default ndc-staging-owner).
D="$(cd "$(dirname "$0")" && pwd)"; S="$D/../scripts"; F="$S/.a6-$(basename "$1")"
cat "$D/lib-bp.js" "$D/$1" > "$F"; (cd "$S" && node api.js "${2:-ndc-staging-owner}" "$(basename "$F")"); rm -f "$F"
