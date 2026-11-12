#!/usr/bin/env bash
# Usage: w4run.sh <snippet.js> <outname> — prelude + w4-lib + snippet (wrapped in try/catch; `out` is global); saves wave4/raw/<outname>.json
E="D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive"
{ cat "$E/scripts/w4-lib.js" "$E/scripts/w4-lib2.js"; echo "let out = {};"; echo "try {"; sed -E 's/^const out = \{\s*(.*)\};/Object.assign(out, {\1});/' "$E/scripts/$1"; echo "} catch (e) { out.ERR = String(e.message).replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }"; } > "$E/scripts/_w4.js"
TMO=${TMO:-450} SESSION=${SESSION:-ndc} bash "$E/scripts/run.sh" _w4.js "$E/wave4/raw/$2.json" || exit 1
node -e 'const o=require(process.argv[1]); const fs=require("fs"); for (const c of (o.CREATED||[])) fs.appendFileSync(process.argv[2], JSON.stringify({...c, at:new Date().toISOString(), from:process.argv[3]})+"\n"); console.log("created", (o.CREATED||[]).length)' "$E/wave4/raw/$2.json" "$E/wave4/after/created.jsonl" "$1"
