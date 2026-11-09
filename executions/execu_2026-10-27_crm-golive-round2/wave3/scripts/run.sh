#!/usr/bin/env bash
# run.sh <account email> <snippet.js> [out.json] — posts a snippet to the runner (one sign-in per account for the runner's life)
W="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave3"
f="$W/scripts/$2"; o="${3:+$W/after/$3}"
curl -s -m 1700 -X POST http://127.0.0.1:47833/run -d "{\"as\":\"$1\",\"file\":\"$f\",\"out\":\"$o\"}"
