#!/usr/bin/env bash
D="$(cd "$(dirname "$0")" && pwd)"
while read -r c; do K=${c%%|*}; C=${c#*|}; echo "== $K $C"; K=$K C=$C bash "$D/uo.sh" u7.js | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const o=JSON.parse(s).out;delete o.panel;delete o.panelAfter;console.log(JSON.stringify(o))}catch(e){console.log(s.slice(0,500))}})"; done
