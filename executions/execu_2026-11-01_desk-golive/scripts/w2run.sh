#!/usr/bin/env bash
# Usage: w2run.sh <snippet.js> <outfile> — runs prelude + w2-lib + snippet; appends CREATED to wave2/after/created.jsonl
E="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive"
cat "$E/scripts/w2-lib.js" "$E/scripts/$1" > "$E/scripts/_w2.js"
TMO=${TMO:-190} bash "$E/scripts/run.sh" _w2.js "$2" || exit 1
node -e 'const o=require(process.argv[1]); const fs=require("fs"); for (const c of (o.CREATED||[])) fs.appendFileSync(process.argv[2], JSON.stringify({...c, at:new Date().toISOString(), from:process.argv[3]})+"\n"); console.log("created", (o.CREATED||[]).length)' "$2" "$E/wave2/after/created.jsonl" "$1"
