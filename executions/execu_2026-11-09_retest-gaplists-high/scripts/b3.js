const fs=require('fs');const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/locales/';fs.mkdirSync(D,{recursive:true});
const out={};
for(const host of ['https://staging-desk.taviportal.com','https://staging-crm.taviportal.com']){
 const r=await ctx.request.get(host+'/',{timeout:60000});const html=await r.text();
 const js=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
 let names=new Set();
 for(const j of js){const t=await (await ctx.request.get(new URL(j,host).href,{timeout:90000})).text();for(const m of t.matchAll(/locales\/[^"'`]*?\{\{ns\}\}|["'`]([a-z][a-z0-9-]{2,40})\.json["'`]/g)) if(m[1]) names.add(m[1]);
   for(const m of t.matchAll(/ns:\s*\[([^\]]{0,3000})\]/g)) for(const n of m[1].matchAll(/["']([a-z][a-z0-9-]{2,40})["']/g)) names.add(n[1]);}
 out[host]={js:js.length,names:[...names].slice(0,300)};
}
return out;
