#!/usr/bin/env bash
# Usage: scripts/open.sh <session> <email>  — fresh sign-in (no secret printed), load state into the named session.
S="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/f1cf398a-8f08-4c25-94f7-f92da3730424/scratchpad/desk/modules1005"
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"
CLI="$P/node_modules/@playwright/cli/playwright-cli.js"
cd "$P" || exit 1
P="$P" node "$S/mklogin.js" "$2" "$S/state-$1.json" < /dev/null || exit 1
node "$CLI" -s="$1" open ${3:+--browser=$3} https://staging-desk.taviportal.com/login < /dev/null > /dev/null 2>&1
node "$CLI" -s="$1" state-load "$S/state-$1.json" < /dev/null > /dev/null 2>&1
node "$CLI" -s="$1" goto https://staging-desk.taviportal.com/hq < /dev/null 2>&1 | grep -E 'Page URL'
