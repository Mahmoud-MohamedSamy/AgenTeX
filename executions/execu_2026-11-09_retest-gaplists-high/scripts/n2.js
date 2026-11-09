const fs=require('fs');const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/locales/';fs.mkdirSync(D,{recursive:true});
const ns=['crm-desk-integration','settings','iam','desk','crm','common','modules','workflow','approvals','blueprint','assignment-rules','sla','reports','views','notifications'];
const out={};
for(const host of ['https://staging-desk.taviportal.com','https://staging-crm.taviportal.com']){out[host]=[];
 for(const n of ns){try{const r=await ctx.request.get(host+'/locales/en/'+n+'.json',{timeout:20000,failOnStatusCode:false});const t=await r.text();
  if(r.status()===200&&t.trim().startsWith('{')){fs.writeFileSync(D+(host.includes('crm')?'crm_':'desk_')+n+'.json',t);out[host].push(n+':'+t.length);}}catch(e){out[host].push(n+':ERR');}}}
return out;
