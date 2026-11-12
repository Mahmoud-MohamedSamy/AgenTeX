#!/usr/bin/env bash
# Usage: get.sh <outfile> <path1> [path2 ...] — GET each path as the logged-in user and save {path:{s,j}}.
E="D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive"; OUT="$1"; shift
P=$(node -e 'console.log(JSON.stringify(process.argv.slice(1)))' "$@"); sed "s#__PATHS__#$P#" "$E/scripts/getmany.js" > "$E/scripts/_get.js"
TMO=${TMO:-200} bash "$E/scripts/run.sh" _get.js "$OUT"
