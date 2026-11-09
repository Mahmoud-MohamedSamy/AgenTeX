const fs=require('fs');const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/bundles/';fs.mkdirSync(D,{recursive:true});
const out={};
for(const host of ['https://staging-desk.taviportal.com','https://staging-crm.taviportal.com']){
 const tag=host.includes('crm')?'crm':'desk';const seen=new Set();const q=[];
 const html=await (await ctx.request.get(host+'/',{timeout:60000})).text();
 for(const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) q.push(new URL(m[1],host).href);
 let n=0,bytes=0;
 while(q.length&&n<600){const u=q.shift();if(seen.has(u))continue;seen.add(u);
  let t='';try{t=await (await ctx.request.get(u,{timeout:30000})).text();}catch(e){continue}
  n++;bytes+=t.length;fs.appendFileSync(D+tag+'.js','\n/*FILE '+u+'*/\n'+t);
  for(const m of t.matchAll(/["'`](\.{0,2}\/?(?:assets\/)?[A-Za-z0-9_.\-\/]+\.js)["'`]/g)){try{const v=new URL(m[1],u).href;if(v.startsWith(host)&&!seen.has(v))q.push(v)}catch(e){}}
 }
 out[tag]={files:n,bytes};
}
return out;
