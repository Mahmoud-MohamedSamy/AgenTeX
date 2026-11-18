#!/usr/bin/env bash
# Usage: ZP=<port> z2.sh <file.js>
ZURL="http://127.0.0.1:${ZP:-8891}/run" node -e 'const fs=require("fs");const code=fs.readFileSync(process.argv[1],"utf8");fetch(process.env.ZURL,{method:"POST",body:JSON.stringify({code})}).then(r=>r.text()).then(t=>{console.log(t.slice(0,8000))}).catch(e=>console.log("ERR",e.message))' "$1"
