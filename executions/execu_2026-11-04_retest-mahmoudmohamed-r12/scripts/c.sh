#!/bin/sh
# Runs inline CODE (env) against NDC-Staging CRM with the owner's saved CRM session. Usage: CODE='…' sh c.sh
S="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/ced3d44b-2788-4572-9c5a-70d3d98f8ebd/scratchpad"
cd "$(dirname "$0")" && ONLY=1 MSYS_NO_PATHCONV=1 node multi.js - "o=$S/state-r12o.json"
