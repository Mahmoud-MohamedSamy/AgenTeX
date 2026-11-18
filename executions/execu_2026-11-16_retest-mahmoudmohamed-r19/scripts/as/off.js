var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const res=[];
for(const r of (await listRules('round_robin',AOB)).filter(r=>/QA RT19 AS/.test(r.name)&&r.is_active))res.push(r.name+' '+await setA(r.id,false));
return res;
