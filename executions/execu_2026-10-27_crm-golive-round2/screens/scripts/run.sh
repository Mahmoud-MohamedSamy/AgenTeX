#!/usr/bin/env bash
# run.sh <port> <snippet.js> [out.json] — sends a snippet to a drv.js session; prints (and saves) the JSON result.
D="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/screens"
R=$(curl -s --max-time ${TMO:-600} -X POST --data-binary @"$D/scripts/$2" "http://127.0.0.1:$1/run")
if [ -n "$3" ]; then printf '%s' "$R" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{require("fs").writeFileSync(process.argv[1],JSON.stringify(JSON.parse(s),null,1))})' "$D/$3"; fi
printf '%s' "$R" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.stringify(JSON.parse(s),null,1).slice(0,+process.argv[1]||6000))}catch(e){console.log(s.slice(0,2000))}})' "${LEN:-6000}"
