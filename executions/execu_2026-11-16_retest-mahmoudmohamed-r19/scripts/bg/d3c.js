var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);
const inA=L.filter(x=>(x.department_ids||[]).includes(DA)).map(x=>[nm(x.user_id),x.name,x.status]);
const act=(await listRules('round_robin',DA)).filter(r=>r.is_active).map(r=>[r.name,JSON.stringify(r.targets?.[0]?.criteria||{}).slice(0,200)]);
const dir=(await listRules('direct')).filter(r=>r.is_active).map(r=>[r.name,JSON.stringify(r.targets||[]).slice(0,300)]);
return {inA,act,dir};
