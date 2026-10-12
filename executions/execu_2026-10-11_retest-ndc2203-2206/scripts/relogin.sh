#!/usr/bin/env bash
# Usage: relogin.sh <session> <email> — fresh sign-in (no secret printed), load state into session.
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; R="$P/executions/execu_2026-10-11_retest-ndc2203-2206/scripts"
ST="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/ff50bd80-92f4-42f1-a4f9-c0237e326ba2/scratchpad/state-$1.json"
cd "$P"; node "$R/login.js" "$2" "$ST" </dev/null || exit 1
node node_modules/@playwright/cli/playwright-cli.js -s="$1" state-load "$ST" </dev/null >/dev/null 2>&1; echo loaded
