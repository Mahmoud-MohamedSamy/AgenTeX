#!/usr/bin/env bash
# Usage: relogin.sh <session> <username> — fresh sign-in (no secret printed), state loaded into the session.
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; E="$P/executions/execu_2026-10-26_desk-activities-replies"; ST="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/78e9ef04-c27b-42b4-8452-a5ad34c618c7/scratchpad/state-$1.json"
cd "$P"; node "$E/scripts/login-desk.js" "$2" "$ST" </dev/null || exit 1
node node_modules/@playwright/cli/playwright-cli.js -s="$1" open --browser=msedge </dev/null >/dev/null 2>&1
node node_modules/@playwright/cli/playwright-cli.js -s="$1" state-load "$ST" </dev/null >/dev/null 2>&1; echo loaded
