const fs=require('fs');const C='https://staging-crm.taviportal.com';const DIR='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/crmjs/';fs.mkdirSync(DIR,{recursive:true});
const h=await (await ctx.request.get(C+'/',{timeout:60000})).text();
const queue=[...h.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);const seen=new Set();let n=0;
while(queue.length&&n<500){const u=queue.shift();if(seen.has(u))continue;seen.add(u);let t='';try{t=await (await ctx.request.get(C+u,{timeout:60000})).text();}catch(e){}
 fs.writeFileSync(DIR+u.split('/').pop(),t);n++;for(const m of t.matchAll(/["'`]\.?\/?(assets\/[A-Za-z0-9_.-]+\.js)["'`]/g)){const p='/'+m[1];if(!seen.has(p))queue.push(p);}}
for(const l of ['iam','crm-approvals','approvals','settings','crm-modules']){try{const t=await (await ctx.request.get(C+'/locales/en/'+l+'.json',{timeout:30000})).text();fs.writeFileSync(DIR+'loc-'+l+'.json',t);}catch(e){}}
return {n};
