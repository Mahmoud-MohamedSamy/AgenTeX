const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message:'';
let r = await api('GET','/desk/departments'); const ds = arr(r.j&&r.j.data); const d = (r.j.data.departments||ds); log(r.s, (d||[]).map(x=>x.name+':'+x.id+(x.is_default||x.isDefault?' DEFAULT':'')).join(' | ').slice(0,1500));
