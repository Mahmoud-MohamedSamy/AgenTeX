#!/usr/bin/env bash
# bp/runa.sh <script.js> — lib.js + script through apiwa.js as agent CES2 (own state r20-bp-agent.json)
D="$(cd "$(dirname "$0")" && pwd)"; F="$D/.runa-$(basename "$1")"
cat "$D/lib.js" "$D/$1" > "$F"; (cd "$D" && APP=desk node apiwa.js a "$F"); rm -f "$F"
