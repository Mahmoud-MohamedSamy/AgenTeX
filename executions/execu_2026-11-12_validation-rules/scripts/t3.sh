#!/usr/bin/env bash
# t2.sh <port> <crm|desk> <step.js> — step is `async (page, ctx) => {...}` and can use ulib.js helpers
cd "$(dirname "$0")"
node -e '
const fs=require("fs");const [port,app,step]=process.argv.slice(1);
const code="(async (page,ctx)=>{globalThis.__APP="+JSON.stringify(app)+";globalThis.__IDS="+(process.env.IDS||"{}")+";\n"+fs.readFileSync("ulib.js","utf8")+"\nreturn await ("+fs.readFileSync(step,"utf8")+")(page,ctx);})";
fetch("http://127.0.0.1:"+port+"/run",{method:"POST",body:JSON.stringify({code})}).then(r=>r.text()).then(t=>console.log(t.slice(0,15000))).catch(e=>console.log("ERR",e.message))' "$1" "$2" "$3"
