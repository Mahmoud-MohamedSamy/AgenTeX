#!/bin/bash
cd "D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/scripts"
S=C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad
cat sr/ulib.js "sr/$1" > $S/sr18-ui.js
APP=${APP:-crm} node ui.js ${WHO:-o} $S/sr18-ui.js
