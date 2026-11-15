#!/bin/bash
# bash t/a.sh <file> [who]  API (APP env, default crm)
cd "D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/scripts"
cat t/common.js "t/$1" > t/_r_$1; APP=${APP:-crm} node apiw.js ${2:-o} t/_r_$1
