#!/usr/bin/env bash
# run as Mahmoud Samy (own state r19-ntf-samy.json)
D="$(cd "$(dirname "$0")" && pwd)"; F="$D/.runs-$(basename "$1")"
cat "$D/lib.js" "$D/$1" > "$F"; (cd "$D" && APP=desk node apiw-samy.js samy "$F"); rm -f "$F"
