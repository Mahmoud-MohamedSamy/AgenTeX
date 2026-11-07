#!/bin/sh
# Runs inline CODE (env) against NDC-Staging Desk with the owner's saved session (and agent's when present). Usage: CODE='…' sh d.sh
S="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/ced3d44b-2788-4572-9c5a-70d3d98f8ebd/scratchpad"
A=""; [ -f "$S/state-r12desk-a.json" ] && A="a=$S/state-r12desk-a.json"
cd "$(dirname "$0")" && ONLY=1 MSYS_NO_PATHCONV=1 HOMEH=https://staging-desk.taviportal.com node multi.js - "o=$S/state-r12desk-o.json" $A
