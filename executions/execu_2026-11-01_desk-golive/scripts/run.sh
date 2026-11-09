#!/usr/bin/env bash
# Usage: run.sh <snippet.js> [outfile] — runs prelude.js + snippet in playwright-cli session ${SESSION:-gl}. Secrets filtered from output.
P="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; E="$P/executions/execu_2026-11-01_desk-golive"
F='authorization|bearer|cookie|token'
cd "$P"; OUT=$(timeout ${TMO:-170} node node_modules/@playwright/cli/playwright-cli.js -s=${SESSION:-gl} run-code "async page => { $(cat "$E/scripts/prelude.js" "$E/scripts/$1") }" </dev/null 2>&1 | grep -v -i -E "$F")
J=$(printf '%s\n' "$OUT" | awk '/^### Result/{f=1;next} /^### /{f=0} f')
if [ -z "$J" ]; then printf "%s\n" "$OUT" | head -c 3000; exit 1; fi
if [ -n "$2" ]; then printf '%s' "$J" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let v=JSON.parse(s);if(typeof v==="string")v=JSON.parse(v);require("fs").writeFileSync(process.argv[1],JSON.stringify(v,null,1));console.log("saved",process.argv[1])})' "$2"; else printf '%s\n' "$J" | head -c ${MAXC:-8000}; fi
