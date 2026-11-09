#!/bin/sh
# Runs inline CODE (env) against NDC-Staging CRM with the owner's saved CRM session. Usage: CODE='…' sh c.sh
S="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad"
cd "$(dirname "$0")" && MSYS_NO_PATHCONV=1 node multi.js - "o=$S/state-r11o.json"
