#!/usr/bin/env bash
# Usage: bp/run.sh <script.js> [who]  — prepends bp/lib.js and runs through apiw.js (owner session r18-o by default)
D="$(cd "$(dirname "$0")" && pwd)"; S="$D/.."; F="$D/.run-$(basename "$1")"
cat "$D/lib.js" "$D/$1" > "$F"; (cd "$S" && APP=desk node apiw.js "${2:-o}" "$F"); rm -f "$F"
