#!/bin/sh
D="$(cd "$(dirname "$0")" && pwd)"
cat "$D/ulib.js" "$1" > "$D/_tmp_$(basename $1)"
cd "$D/.." && APP=crm node ui.js o "$D/_tmp_$(basename $1)"
