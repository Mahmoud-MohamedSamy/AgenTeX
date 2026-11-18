#!/usr/bin/env bash
# Usage: tk/run.sh ui|api <script.js>
D="$(cd "$(dirname "$0")" && pwd)"; S="$D/.."; F="$D/.run-$(basename "$2")"
if [ "$1" = ui ]; then cat "$D/uilib.js" "$D/$2" > "$F"; (cd "$S" && node ui.js o "$F"); else cat "$D/lib.js" "$D/$2" > "$F" 2>/dev/null || cp "$D/$2" "$F"; (cd "$S" && APP=desk node apiw.js o "$F"); fi; rm -f "$F"
