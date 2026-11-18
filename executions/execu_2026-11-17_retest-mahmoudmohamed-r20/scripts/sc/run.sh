#!/bin/sh
# usage: sh run.sh script.js   (prepends lib.js, runs via apiw with owner session, APP=crm)
D="$(cd "$(dirname "$0")" && pwd)"
cat "$D/lib.js" "$1" > "$D/_tmp_$(basename $1)"
cd "$D/.." && APP=crm node apiw.js o "$D/_tmp_$(basename $1)"
