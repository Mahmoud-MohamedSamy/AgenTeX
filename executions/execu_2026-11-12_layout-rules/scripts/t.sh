#!/usr/bin/env bash
# t.sh <port> <file.js>  — run code in a UI server
node -e 'const fs=require("fs");const code=fs.readFileSync(process.argv[2],"utf8");fetch("http://127.0.0.1:"+process.argv[1]+"/run",{method:"POST",body:JSON.stringify({code})}).then(r=>r.text()).then(t=>{console.log(t.slice(0,12000))}).catch(e=>console.log("ERR",e.message))' "$1" "$2"
