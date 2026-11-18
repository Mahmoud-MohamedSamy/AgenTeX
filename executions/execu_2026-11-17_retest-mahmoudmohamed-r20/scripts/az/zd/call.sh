#!/bin/sh
# usage: call.sh file.js  (file contains an expression "async (page, ctx) => ...")
node -e "const fs=require('fs');const code=fs.readFileSync(process.argv[1],'utf8');fetch('http://127.0.0.1:8896/run',{method:'POST',body:JSON.stringify({code})}).then(r=>r.text()).then(t=>{const j=JSON.parse(t);console.log(j.ok?(typeof j.out==='string'?j.out:JSON.stringify(j.out,null,1)):'ERR '+j.err)})" "$1" | sed -E 's/[[:alnum:]._%+-]+@[[:alnum:].-]+/<email>/g'
