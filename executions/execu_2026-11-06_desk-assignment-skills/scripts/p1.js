const o={};
for (const p of ['/desk/assignment-rules','/desk/departments','/desk/teams','/desk/skills','/desk/skill-preferences','/desk/assignment/notification-settings','/desk/agent-skills','/desk/assignment-backlog']) { const r=await api('GET',p); o[p]={s:r.s,t:r.t.slice(0,1500)}; }
// bundle paths
const html = await page.content(); const js=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]); o.js=js;
const set=new Set(); const seen=new Set(); const q=[...js];
while(q.length && seen.size<400){ const u=q.shift(); if(seen.has(u)) continue; seen.add(u); try{ const r=await page.request.get(new URL(u,H).href); const t=await r.text();
 for(const m of t.matchAll(/["`'](\/desk\/[A-Za-z0-9_\/${}.:-]*(?:assign|skill|round|robin|backlog|routing|presence|availab)[A-Za-z0-9_\/${}.:-]*)/gi)) set.add(m[1]);
 for(const m of t.matchAll(/["'(]\.?\.?\/?(assets\/[A-Za-z0-9_.-]+\.js)/g)) { const v='/'+m[1]; if(!seen.has(v)) q.push(v);} }catch(e){} }
o.paths=[...set].sort(); o.chunks=seen.size; return o;
