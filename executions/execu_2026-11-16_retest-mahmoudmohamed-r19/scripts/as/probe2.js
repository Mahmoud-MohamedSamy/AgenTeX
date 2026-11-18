var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const R={};
R.rr=(await listRules('round_robin',DA)).filter(r=>r.is_active).map(r=>({n:r.name,on:r.execute_on,t:r.targets.map(t=>({c:t.criteria,m:t.method,p:t.pool}))}));
R.keys=Object.keys((await listRules('round_robin',DA))[0]);
for(const d of [DB,'f4bb810f']){}
const x=(await api('GET','/desk/agents/'+A3+'/workload')).j;R.a3=x;
R.depA=(await api('GET','/desk/departments/'+DA)).j?.data;
return R;
