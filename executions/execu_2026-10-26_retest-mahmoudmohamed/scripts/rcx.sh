#!/usr/bin/env bash
# Usage: rcx.sh <script.js> — runs lib-wf.js + script in the Desk session "wf"; ids in "created" go to ../ledger.json.
D="$(cd "$(dirname "$0")" && pwd)"; cat "$D/lib-wf.js" "$D/$1" > "$D/.run-$1"; node "$D/rc-desk.js" wf "$D/.run-$1" > "$D/.out-$1"; rm -f "$D/.run-$1"
node -e '
const fs=require("fs"), f=process.argv[1], L=process.argv[2]; const t=fs.readFileSync(f,"utf8"); let o; try { o=JSON.parse(t); } catch(e) { console.log(t); process.exit(0); }
if (o && o.created) { let l=[]; try { l=JSON.parse(fs.readFileSync(L,"utf8")); } catch(e) {} l.push(...o.created); fs.writeFileSync(L, JSON.stringify(l,null,1)); o.created=o.created.length+" ids -> ledger.json"; }
console.log(JSON.stringify(o,null,1));' "$D/.out-$1" "$D/../ledger.json"
