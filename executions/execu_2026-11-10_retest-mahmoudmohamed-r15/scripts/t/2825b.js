const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b'; const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const ps = await api('GET','/desk/sla/policies?department_id='+AO); const list = arr(ps.j&&ps.j.data);
const sample = list[0]; if (!sample) return {noPolicy:true, s:ps.s};
const full = (await api('GET','/desk/sla/policies/'+sample.id)).j.data;
return {keys:Object.keys(full), sample: JSON.stringify(full).slice(0,1800)};
