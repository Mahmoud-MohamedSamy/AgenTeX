#!/usr/bin/env bash
# run.sh <snippet.js> [out.json]  — posts a snippet to runner.js (CRM Admin A signed in once for the runner's life)
W="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave5"
f="$W/scripts/$1"; o="${2:+$W/after/$2}"
curl -s -m ${TMO:-1700} -X POST http://127.0.0.1:47835/run -d "{\"file\":\"$f\",\"out\":\"$o\"}"
