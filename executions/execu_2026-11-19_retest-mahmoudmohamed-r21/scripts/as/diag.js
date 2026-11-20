var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const o={};
o.rulesAOB=(await listRules('round_robin',AOB)).filter(r=>r.is_active).map(r=>[r.name,r.execute_on,JSON.stringify(r.targets?.[0]?.criteria).slice(0,160),r.targets?.[0]?.pool?.user_ids?.map(nm)]);
o.rulesDA=(await listRules('round_robin',DA)).filter(r=>r.is_active).map(r=>[r.name,r.targets?.[0]?.method,r.targets?.[0]?.pool?.user_ids?.map(nm)]);
o.prefsAOB=await prefs(AOB);o.prefsDA=await prefs(DA);o.presence=await presence();
const d=await api('GET','/desk/departments/'+AOB);o.deptAgents=d.s+' '+JSON.stringify((d.j?.data?.agents||d.j?.data?.agent_user_ids||[])).slice(0,300);
const id=made.tickets[made.tickets.length-1];const raw=(await api('GET','/desk/tickets/'+id)).j?.data;o.lastTicket=[raw?.ticket_number,raw?.status,raw?.in_backlog,raw?.department_id?.slice(0,8)];
return o;
