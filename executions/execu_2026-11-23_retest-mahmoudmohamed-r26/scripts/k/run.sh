#!/usr/bin/env bash
# k/run.sh <script.js> [who] — prepends k/lib.js, runs through apiw.js (session r18-<who>.json, default owner o)
D="$(cd "$(dirname "$0")" && pwd)"; S="$D/.."; F="$D/.run-$(basename "$1")"
cat "$D/lib.js" "$D/$1" > "$F"; (cd "$S" && APP=${APP:-desk} node apiw.js "${2:-o}" "$F"); rm -f "$F"
