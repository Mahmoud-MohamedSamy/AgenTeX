#!/usr/bin/env bash
# Usage: ui.sh <snippet.js> [outfile] — runs a page snippet in the CRM Admin A browser session r2w2ui (no sign-in here).
R="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; W="$R/executions/execu_2026-10-27_crm-golive-round2/wave2"
cd "$R"; OUT=$(timeout ${TMO:-300} node node_modules/@playwright/cli/playwright-cli.js -s=r2w2ui run-code "async page => { const RAW='$W/evidence/raw/'; const out={}; $(cat "$W/scripts/$1") ; return JSON.stringify(out); }" </dev/null 2>&1)
J=$(printf '%s\n' "$OUT" | awk '/^### Result/{f=1;next} /^### /{f=0} f')
if [ -z "$J" ]; then printf "%s\n" "$OUT" | head -c 3000; exit 1; fi
printf '%s' "$J" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let v=JSON.parse(s); if(typeof v==="string") v=JSON.parse(v); const t=JSON.stringify(v,null,1); if(process.argv[1]) require("fs").writeFileSync(process.argv[1], t); console.log(t.slice(0,5000));})' "$2"
