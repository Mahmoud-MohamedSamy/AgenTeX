#!/usr/bin/env bash
# Usage: z.sh <file.js containing an async (page, frame, ctx) => {...} expression>
node -e 'const fs=require("fs");const code=fs.readFileSync(process.argv[1],"utf8");fetch("http://127.0.0.1:8891/run",{method:"POST",body:JSON.stringify({code})}).then(r=>r.text()).then(t=>{console.log(t.slice(0,6000))}).catch(e=>console.log("ERR",e.message))' "$1"
