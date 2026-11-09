const fs=require('fs');const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/';
const out={};
for(const p of ['/iam/me','/desk/integrations/crm/status','/desk/integrations/crm/config','/desk/integrations/crm/products','/desk/integrations/crm/runs?limit=5','/desk/integrations/crm/history']){
 const r=await api('GET',p);out[p]=r.s;fs.writeFileSync(R+'ndc-2392/raw/'+p.replace(/[\/?=&]/g,'_')+'.json',r.t.length>=3000?JSON.stringify(r.j,null,1)||r.t:r.t);}
// full text (api() truncates t to 3000; j is full)
const c=await api('GET','/desk/integrations/crm/config');fs.writeFileSync(R+'ndc-2392/raw/config-full.json',JSON.stringify(c.j,null,1));
const me=await api('GET','/iam/me');out.profiles=(me.j.data.profiles||[]).map(p=>p.name+'@'+p.rank);
return out;
