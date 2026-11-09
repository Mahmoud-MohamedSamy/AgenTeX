#!/bin/sh
# Runs inline CODE (env) against NDC-Staging Desk with the owner's saved session (and agent's when present). Usage: CODE='…' sh d.sh
S="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad"
A=""; [ -f "$S/state-r11desk-a.json" ] && A="a=$S/state-r11desk-a.json"
cd "$(dirname "$0")" && MSYS_NO_PATHCONV=1 HOMEH=https://staging-desk.taviportal.com node multi.js - "o=$S/state-r11desk-o.json" $A
