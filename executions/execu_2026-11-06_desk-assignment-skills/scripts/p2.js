const html = await page.content(); const q=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]); const seen=new Set(); const hits={};
while(q.length && seen.size<600){ const u=q.shift(); if(seen.has(u)) continue; seen.add(u); let t=''; try{ t=await (await page.request.get(new URL(u,H).href)).text(); }catch(e){continue}
 for(const m of t.matchAll(/["'(]\.?\.?\/?(assets\/[A-Za-z0-9_.-]+\.js)/g)){ const v='/'+m[1]; if(!seen.has(v)) q.push(v);} 
 if(/AssignmentRules|Skill|RoundRobin|round_robin_preferences|roundRobin/i.test(u) || /\/desk\/assignment-rules/.test(t)){ const set=new Set(); for(const m of t.matchAll(/\/desk\/[A-Za-z0-9_\/${}.:?=&()-]+/g)) set.add(m[0].slice(0,120)); hits[u]={len:t.length,paths:[...set]}; require('fs').writeFileSync('../out/chunk-'+u.split('/').pop(), t); } }
return {n:seen.size, hits};
