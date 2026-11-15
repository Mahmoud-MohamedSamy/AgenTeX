#!/bin/bash
cd "D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/scripts"
APP=${APP:-crm} node ui.js ${2:-o} t/$1
