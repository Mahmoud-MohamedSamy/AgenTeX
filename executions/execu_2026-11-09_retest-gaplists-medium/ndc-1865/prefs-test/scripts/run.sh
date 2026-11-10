#!/bin/sh
cd "$(dirname "$0")" && cat lib.js "$1" > _run.js && node ../../../laneC-scripts/apirun.js "C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/laneN-m.json" _run.js 2>&1 | head -${2:-80}
