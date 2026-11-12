#!/usr/bin/env bash
# Usage: open.sh [session] — open Edge session and load the saved owner state (no new sign-in).
P="D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX"; S="C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/f8ef493a-ea8b-46bf-90e4-4def7dea2502/scratchpad"
cd "$P"; node node_modules/@playwright/cli/playwright-cli.js -s=${1:-gl} open --browser=msedge </dev/null >/dev/null 2>&1
node node_modules/@playwright/cli/playwright-cli.js -s=${1:-gl} state-load "$S/state-${STATE:-owner}.json" </dev/null >/dev/null 2>&1; echo opened ${1:-gl}
