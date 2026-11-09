const base=H+'/assets/';const idx=await (await ctx.request.get(base+'index-LdioPOXJ.js')).text();
const o={move:[...idx.matchAll(/.{0,160}V\(e,`(?:move|transfer|department)[^`]*`\)[^]{0,200}/g)].slice(0,4).map(m=>m[0]),
 V:[...new Set([...idx.matchAll(/V\(e,`([^`]+)`\)/g)].map(m=>m[1]))]};
o.team=await api('GET','/desk/teams/8d2b7e89-1758-4abb-9595-88fbe52d1679').then(r=>r.s+' '+(r.j?.data?.name||''));
return o;
