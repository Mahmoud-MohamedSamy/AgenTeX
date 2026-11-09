#!/usr/bin/env bash
# Usage: zn.sh <file.js with async (page, ctx, blocked) => {...}> [outfile] — runs in the READ-ONLY NDC Zoho server (8892)
node -e 'const fs=require("fs");const code=fs.readFileSync(process.argv[1],"utf8");fetch("http://127.0.0.1:8892/run",{method:"POST",body:JSON.stringify({code}),signal:AbortSignal.timeout(590000)}).then(r=>r.text()).then(t=>{if(process.argv[2]){fs.writeFileSync(process.argv[2],t);console.log("saved",process.argv[2],t.length)}else console.log(t.slice(0,+process.env.MAXC||8000))}).catch(e=>console.log("ERR",e.message))' "$1" "$2"
