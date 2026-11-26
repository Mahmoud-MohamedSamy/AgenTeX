#!/bin/bash
# usage: run3.sh <label> <app> <case.js>  (tlib + p3lib + case)
D="$(cd "$(dirname "$0")" && pwd)"; F="$D/.tmp-$$-$(basename "$3")"
cat "$D/tlib.js" "$D/cases/p3lib.js" "$3" > "$F"; WHO="$1" APP="$2" node "$D/api.js" "$1" "$F"; rc=$?; rm -f "$F"; exit $rc
