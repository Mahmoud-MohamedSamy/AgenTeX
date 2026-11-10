#!/bin/sh
# usage: sh run.sh iN   (concats lib.js + iN.js and runs it with the saved session)
cd "$(dirname "$0")/scripts" && cat lib.js "$1.js" > _run.js && node apirun.js "C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/laneI-owner.json" _run.js 2>&1 | tail -80
