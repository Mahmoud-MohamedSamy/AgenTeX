const fs=require('fs');const SP='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/laneE-bundle/';fs.mkdirSync(SP,{recursive:true});
const html=await (await ctx.request.get(H+'/')).text();
const js=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);const out={js};
const seen=new Set();const q=[...js];
while(q.length&&seen.size<400){const u=q.shift();if(seen.has(u))continue;seen.add(u);const r=await ctx.request.get(u.startsWith('http')?u:H+u);if(!r.ok())continue;const t=await r.text();const n=u.split('/').pop();fs.writeFileSync(SP+n,t);for(const m of t.matchAll(/["'`(]\.?\.?\/?(?:assets\/)?([A-Za-z0-9_.-]+-[A-Za-z0-9_-]{6,}\.js)["'`]/g)){const v='/assets/'+m[1];if(!seen.has(v))q.push(v);}}
out.files=seen.size;return out;
