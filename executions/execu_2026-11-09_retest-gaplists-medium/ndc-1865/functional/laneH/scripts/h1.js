const fs=require('fs');const dir='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/laneH-bundle';fs.mkdirSync(dir,{recursive:true});
const html=await (await ctx.request.get(H+'/')).text();const main=[...html.matchAll(/assets\/[^"']+\.js/g)].map(x=>x[0]);
const seen=new Set();const q=[...new Set(main)];let n=0;
while(q.length&&n<400){const f=q.shift();if(seen.has(f))continue;seen.add(f);const r=await ctx.request.get(H+'/'+f);if(!r.ok())continue;const t=await r.text();n++;fs.writeFileSync(dir+'/'+f.split('/').pop(),t);for(const m of t.matchAll(/["'`](?:\.\/|\/assets\/|assets\/)?([A-Za-z0-9_.-]+\.js)["'`]/g)){const p='assets/'+m[1];if(!seen.has(p))q.push(p);}}
return {files:n};
