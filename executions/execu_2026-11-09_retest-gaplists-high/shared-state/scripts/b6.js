const fs=require('fs');const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/evidence/raw/';const out={};
const l=await api('GET','/workflow/approval-processes');out.listS=l.s;const ps=arr(l.j&&l.j.data!==undefined?l.j.data:l.j);out.count=ps.length;
out.procs=ps.map(p=>({id:p.id,n:p.name,mod:p.module_id||p.moduleId,act:p.is_active??p.isActive}));
const lv=[];for(const p of ps.slice(0,40)){const d=await api('GET','/workflow/approval-processes/'+p.id);const s=JSON.stringify(d.j);if(/level|depth|manager/i.test(s))lv.push({id:p.id,n:p.name,snip:(s.match(/.{0,120}(levels|depth|manager).{0,160}/i)||[''])[0]});}
out.levelHits=lv.slice(0,5);
if(ps[0]){const d=await api('GET','/workflow/approval-processes/'+ps[0].id);fs.writeFileSync(R+'approval-process-sample.json',JSON.stringify(d.j,null,1));}
return out;
