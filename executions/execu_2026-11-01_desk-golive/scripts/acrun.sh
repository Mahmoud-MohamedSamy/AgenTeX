#!/usr/bin/env bash
# Usage: w5run.sh <snippet.js> <outname> — prelude + w4-lib + snippet (wrapped in try/catch; `out` is global); saves wave5/raw/<outname>.json
E="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive"
{ cat "$E/scripts/w4-lib.js" "$E/scripts/w4-lib2.js" "$E/scripts/w5-lib.js" "$E/scripts/w5-rlib.js" "$E/scripts/tm-lib.js" "$E/scripts/ac-lib.js"; echo "let out = {};"; echo "try {"; sed -E 's/^const out = \{\s*(.*)\};/Object.assign(out, {\1});/' "$E/scripts/$1"; echo "} catch (e) { out.ERR = String(e.message).split('Call log')[0].replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }"; } > "$E/scripts/_ac.js"
TMO=${TMO:-450} SESSION=${SESSION:-ndc} bash "$E/scripts/run.sh" _ac.js "$E/access/raw/$2.json" || exit 1
node -e "const fs=require(\"fs\");const p=process.argv[1];if(fs.existsSync(p)){fs.writeFileSync(p,fs.readFileSync(p,\"utf8\").replace(/eyJ[A-Za-z0-9_\-\.]{10,}/g,\"[JWT-REDACTED]\"))}" "$E/access/raw/$2.json"
node -e 'const o=require(process.argv[1]); const fs=require("fs"); for (const c of (o.CREATED||[])) fs.appendFileSync(process.argv[2], JSON.stringify({...c, at:new Date().toISOString(), from:process.argv[3]})+"\n"); console.log("created", (o.CREATED||[]).length)' "$E/access/raw/$2.json" "$E/access/created.jsonl" "$1"
