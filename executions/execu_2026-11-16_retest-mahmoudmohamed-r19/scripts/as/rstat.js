var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const out=[];
for(const [t,d] of [['round_robin',DA],['round_robin',DB],['direct',null]]){const L=await listRules(t,d);for(const r of L)if(/QA RT19 AS/.test(r.name))out.push([t,nm(d),r.id.slice(0,8),r.name,r.is_active,r.version]);}
const r=await api('PUT','/desk/assignment-rules/80e07ace-5182-4951-bd1b-25ac4c9bbf3c/active',{is_active:false});
return {out,try:E(r)};
