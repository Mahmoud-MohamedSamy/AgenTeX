#!/usr/bin/env bash
# Usage: ax.sh <who: admin|agent> <script.js> — runs enc/done + lib-wf.js + script with apirun-desk.js (one browser, closed after);
# ids in "created" are appended to ../ledger.json. No secret is printed.
D="$(cd "$(dirname "$0")" && pwd)"; S="C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/3b03ac4f-1ce1-4a04-9337-4cb90e2010e4/scratchpad"
ST="$S/state-desk-$1.json"
{ grep -m1 '^const enc' "$D/prelude-desk.js"; echo 'const done = o => o;'; cat "$D/lib-wf.js" "$D/$2"; } > "$D/.run-$2"
node "$D/apirun-desk.js" "$ST" "$D/.run-$2" > "$D/.out-$2" 2>&1; rm -f "$D/.run-$2"
node -e '
const fs=require("fs"), f=process.argv[1], L=process.argv[2]; const t=fs.readFileSync(f,"utf8"); let o; try { o=JSON.parse(t); } catch(e) { console.log(t.slice(0,3000)); process.exit(0); }
if (o && o.created) { let l=[]; try { l=JSON.parse(fs.readFileSync(L,"utf8")); } catch(e) {} l.push(...o.created); fs.writeFileSync(L, JSON.stringify(l,null,1)); o.created=o.created.length+" ids -> ledger.json"; }
console.log(JSON.stringify(o,null,1));' "$D/.out-$2" "$D/../ledger.json"
