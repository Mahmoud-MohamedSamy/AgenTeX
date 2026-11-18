#!/usr/bin/env bash
D="$(cd "$(dirname "$0")" && pwd)"; S="$D/.."; F="$D/.run-$(basename "$1")"
cat "$D/lib.js" "$D/$1" > "$F"; (cd "$S" && APP=desk node apiw.js o "$F"); rm -f "$F"
