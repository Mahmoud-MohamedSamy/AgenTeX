#!/usr/bin/env bash
# Usage: run.sh <snippet.js> [outfile] — runs prelude-desk.js + snippet in playwright-cli session ${SESSION:-ar}; prints or saves the JSON result.
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; E="$P/executions/execu_2026-10-26_desk-activities-replies"
cd "$P"; OUT=$(timeout ${TMO:-170} node node_modules/@playwright/cli/playwright-cli.js -s=${SESSION:-ar} run-code "async page => { $(cat "$E/scripts/prelude-desk.js" "$E/scripts/$1") }" </dev/null 2>&1)
J=$(printf '%s\n' "$OUT" | awk '/^### Result/{f=1;next} /^### /{f=0} f')
if [ -z "$J" ]; then printf "%s\n" "$OUT" | head -c 3000; exit 1; fi
if [ -n "$2" ]; then printf '%s' "$J" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let v=JSON.parse(s); if(typeof v==="string") v=JSON.parse(v); require("fs").writeFileSync(process.argv[1], JSON.stringify(v,null,1)); console.log("saved", process.argv[1], s.length);})' "$2"; else printf '%s\n' "$J" | head -c ${MAXC:-8000}; fi
