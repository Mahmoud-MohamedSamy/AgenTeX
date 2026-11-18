#!/usr/bin/env bash
# x56/runo.sh <script.js> — lib.js + script through shared owner apiw.js (who=o)
D="$(cd "$(dirname "$0")" && pwd)"; F="$D/.runo-$(basename "$1")"
cat "$D/lib.js" "$D/$1" > "$F"; (cd "$D/.." && APP=desk node apiw.js o "$F"); rm -f "$F"
