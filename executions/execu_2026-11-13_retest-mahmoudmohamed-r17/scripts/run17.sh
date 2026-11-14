#!/usr/bin/env bash
# run17.sh <step.js> — common17.js + step, API borrowing the owner browser session (APP=crm default)
D="$(cd "$(dirname "$0")" && pwd)"; cat "$D/common17.js" "$1" > "$D/.cur.js"; cd "$D"; APP=${APP:-crm} node apiw.js o .cur.js
