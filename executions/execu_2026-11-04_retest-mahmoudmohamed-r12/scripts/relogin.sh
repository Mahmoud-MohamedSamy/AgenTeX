#!/usr/bin/env bash
# Usage: relogin.sh <session> <username> — fresh sign-in (no secret printed), load state into the session.
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; R="$P/executions/execu_2026-11-04_retest-mahmoudmohamed-r12/scripts"
ST="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/ced3d44b-2788-4572-9c5a-70d3d98f8ebd/scratchpad/state-$1.json"
cd "$P"; node "$R/login.js" "$2" "$ST" </dev/null || exit 1
node node_modules/@playwright/cli/playwright-cli.js -s="$1" state-load "$ST" </dev/null >/dev/null 2>&1; echo loaded
