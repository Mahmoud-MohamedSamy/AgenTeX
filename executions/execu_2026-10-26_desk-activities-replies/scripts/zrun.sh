#!/usr/bin/env bash
# Usage: zrun.sh <snippet.js> [outfile] — runs a read-only snippet in the Zoho Desk session zd
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; E="$P/executions/execu_2026-10-26_desk-activities-replies"
cd "$P"; OUT=$(timeout ${TMO:-240} node node_modules/@playwright/cli/playwright-cli.js -s=zd run-code "async page => { $(cat "$E/scripts/zprelude.js" "$E/scripts/$1")
return done(); }" </dev/null 2>&1)
J=$(printf '%s\n' "$OUT" | awk '/^### Result/{f=1;next} /^### /{f=0} f')
if [ -z "$J" ]; then printf "%s\n" "$OUT" | head -c 3000; exit 1; fi
printf '%s' "$J" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let v=JSON.parse(s); if(typeof v==="string") v=JSON.parse(v); if(process.argv[1]) require("fs").writeFileSync(process.argv[1], JSON.stringify(v,null,1)); for(const[k,x] of Object.entries(v)) console.log("##",k,"\n"+(typeof x==="string"?x:JSON.stringify(x)).slice(0, +process.env.MAXC||2500));})' "$2"
