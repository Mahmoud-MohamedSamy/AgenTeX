#!/usr/bin/env bash
# Usage: open.sh [session] — open Edge session and load the saved owner state (no new sign-in).
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; S="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/26a0d551-16a6-421d-90b5-d1ea695c4641/scratchpad"
cd "$P"; node node_modules/@playwright/cli/playwright-cli.js -s=${1:-gl} open --browser=msedge </dev/null >/dev/null 2>&1
node node_modules/@playwright/cli/playwright-cli.js -s=${1:-gl} state-load "$S/state-${STATE:-owner}.json" </dev/null >/dev/null 2>&1; echo opened ${1:-gl}
