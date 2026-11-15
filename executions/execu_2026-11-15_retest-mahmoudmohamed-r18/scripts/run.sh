#!/bin/bash
# bash run.sh <step.js>  — prepends lr/lib.js, runs through apiw.js as owner (APP=crm unless set)
cd "D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/scripts"
S=C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad
WHO=${WHO:-o}
cat lr/lib.js "lr/$1" > $S/lr18-step.js
APP=${APP:-crm} node apiw.js $WHO $S/lr18-step.js
