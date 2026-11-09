#!/usr/bin/env bash
D="$(cd "$(dirname "$0")" && pwd)"; cat "$D/lbhelp.js" "$D/$1" > "$D/.run-$1"; node "$D/rc.js" rt "$D/.run-$1"; rm -f "$D/.run-$1"
