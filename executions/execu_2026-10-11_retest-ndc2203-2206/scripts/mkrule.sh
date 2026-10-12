#!/usr/bin/env bash
# Usage: mkrule.sh '<RULE json>'
R="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-11_retest-ndc2203-2206/scripts"
{ echo "const RULE = $1;"; cat "$R/mkrule.js"; } > "$R/_mkrule_run.js"; cd "$R/../../.."; node "$R/rc.js" rt "$R/_mkrule_run.js"
