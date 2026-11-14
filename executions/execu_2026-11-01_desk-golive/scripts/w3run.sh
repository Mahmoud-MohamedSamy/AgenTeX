#!/usr/bin/env bash
# Usage: w3run.sh <snippet.js> <outname> — prelude + w4-lib + snippet (wrapped in try/catch; `out` is global); saves wave3/raw/<outname>.json
E="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive"
{ cat "$E/scripts/w4-lib.js" "$E/scripts/w4-lib2.js" "$E/scripts/w5-lib.js" "$E/scripts/w5-rlib.js"; echo "let out = {};"; echo "try {"; sed -E 's/^const out = \{\s*(.*)\};/Object.assign(out, {\1});/' "$E/scripts/$1"; echo "} catch (e) { out.ERR = String(e.message).replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }"; } > "$E/scripts/_w3.js"
TMO=${TMO:-450} SESSION=${SESSION:-ndc} bash "$E/scripts/run.sh" _w3.js "$E/wave3/raw/$2.json" || exit 1
node -e 'const o=require(process.argv[1]); const fs=require("fs"); for (const c of (o.CREATED||[])) fs.appendFileSync(process.argv[2], JSON.stringify({...c, at:new Date().toISOString(), from:process.argv[3]})+"\n"); console.log("created", (o.CREATED||[]).length)' "$E/wave3/raw/$2.json" "$E/wave3/after/created.jsonl" "$1"
