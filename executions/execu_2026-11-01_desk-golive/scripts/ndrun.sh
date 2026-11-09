#!/usr/bin/env bash
# Usage: ndrun.sh <snippet.js> <outname> — prelude + nd-lib + snippet; saves wave2/raw-ndc/<outname>.json; appends CREATED to wave2/after/created-ndc.jsonl
E="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive"
{ echo "const IDS = $(cat "$E/wave2/raw-ndc/ids.json" 2>/dev/null || echo "{}");"; cat "$E/scripts/nd-lib.js" "$E/scripts/$1"; } > "$E/scripts/_nd.js"
TMO=${TMO:-190} SESSION=${SESSION:-ndc} bash "$E/scripts/run.sh" _nd.js "$E/wave2/raw-ndc/$2.json" || exit 1
node -e 'const o=require(process.argv[1]); const fs=require("fs"); for (const c of (o.CREATED||[])) fs.appendFileSync(process.argv[2], JSON.stringify({...c, at:new Date().toISOString(), from:process.argv[3]})+"\n"); console.log("created", (o.CREATED||[]).length)' "$E/wave2/raw-ndc/$2.json" "$E/wave2/after/created-ndc.jsonl" "$1"
