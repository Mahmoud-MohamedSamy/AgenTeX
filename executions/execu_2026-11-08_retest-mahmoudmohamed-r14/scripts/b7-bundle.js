const base=H+'/assets/';const t=await (await ctx.request.get(base+'SlaPolicyEditorPage-CiMD5JIa.js')).text();
const o={};o.snake=[...new Set([...t.matchAll(/[a-z]+_[a-z_]+/g)].map(m=>m[0]).filter(s=>/escal|assign|notify|reassign|level|after|minutes|priority|team|owner|recipient/.test(s)))].slice(0,80);
o.ser=[...t.matchAll(/.{0,200}assign_team_id[^]{0,400}/g)].slice(0,2).map(m=>m[0]);
o.lvl=[...t.matchAll(/.{0,300}(?:escalations|level)\s*:[^]{0,300}/g)].slice(0,3).map(m=>m[0]);
const p=await api('GET','/desk/sla/policies');o.existing=arr(p.j?.data).map(x=>x.name).slice(0,10);
const withEsc=arr(p.j?.data).find(x=>JSON.stringify(x.targets||'').includes('"response":[{')||JSON.stringify(x.targets||'').includes('"resolution":[{'));o.sampleEsc=withEsc?JSON.stringify(withEsc.targets[0].escalations).slice(0,1200):null;
return o;
