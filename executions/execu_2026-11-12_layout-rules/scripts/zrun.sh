#!/usr/bin/env bash
# zrun.sh <file.js> — run on the Zoho server (8897); masks emails in output
node -e 'const fs=require("fs");fetch("http://127.0.0.1:8897/run",{method:"POST",body:JSON.stringify({code:fs.readFileSync(process.argv[1],"utf8")})}).then(r=>r.text()).then(t=>console.log(t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g,"<email>").slice(0,15000)))' "$1"
