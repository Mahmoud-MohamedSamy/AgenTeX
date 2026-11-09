#!/bin/sh
# Runs inline CODE (env) against NDC-Staging Desk with the owner's saved session (and agent's when present). Usage: CODE='…' sh d.sh
S="C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/5386c806-8be2-419b-b68c-ab282cb30dce/scratchpad"
A=""; [ -f "$S/state-r12desk-a.json" ] && A="a=$S/state-r12desk-a.json"
cd "$(dirname "$0")" && ONLY=1 MSYS_NO_PATHCONV=1 HOMEH=https://staging-desk.taviportal.com node multi.js - "o=$S/state-r12desk-o.json" $A
