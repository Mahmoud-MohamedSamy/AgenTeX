#!/usr/bin/env bash
# Usage: open.sh [session] — open Edge session and load the saved owner state (no new sign-in).
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; S="C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad"
cd "$P"; node node_modules/@playwright/cli/playwright-cli.js -s=${1:-gl} open --browser=msedge </dev/null >/dev/null 2>&1
node node_modules/@playwright/cli/playwright-cli.js -s=${1:-gl} state-load "$S/state-${STATE:-owner}.json" </dev/null >/dev/null 2>&1; echo opened ${1:-gl}
