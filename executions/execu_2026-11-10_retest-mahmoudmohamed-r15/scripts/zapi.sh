#!/usr/bin/env bash
# zapi.sh <body.js> : body runs inside page.evaluate with __z(method,url,body) helper available; must `return`.
L='const __z = async (m, u, body) => { const c = (document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||""; const r = await fetch(u,{method:m,credentials:"include",headers:{orgId:"944875504","Content-Type":"application/json","X-ZCSRF-TOKEN":"crmcsrfparam="+c},body:body?JSON.stringify(body):undefined}); const t = await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,600)}; };'
B=$(cat "$1"); printf 'async (page) => page.evaluate(async () => { %s\n%s\n })' "$L" "$B" > "$1.run.js"; bash "$(dirname "$0")/zd.sh" "$1.run.js"
