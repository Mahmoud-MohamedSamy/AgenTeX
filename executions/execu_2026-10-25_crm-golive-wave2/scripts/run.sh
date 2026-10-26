#!/usr/bin/env bash
# Usage: run.sh <snippet.js> [outfile]  — runs api.js + snippet in the owner session w2; writes the JSON result to outfile.
R="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; W="$R/executions/execu_2026-10-25_crm-golive-wave2"
cd "$R"; OUT=$(timeout ${TMO:-170} node node_modules/@playwright/cli/playwright-cli.js -s=${SESSION:-w2} run-code "async page => { $(cat "$W/scripts/api.js" "$W/scripts/$1") }" </dev/null 2>&1)
J=$(printf '%s\n' "$OUT" | awk '/^### Result/{f=1;next} /^### /{f=0} f')
if [ -z "$J" ]; then printf "%s
" "$OUT" | head -c 3000; exit 1; fi
if [ -n "$2" ]; then printf '%s' "$J" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let v=JSON.parse(s); if(typeof v==="string") v=JSON.parse(v); require("fs").writeFileSync(process.argv[1], JSON.stringify(v,null,1)); console.log("saved", process.argv[1], s.length);})' "$2"; else printf '%s\n' "$OUT" | head -c 6000; fi
