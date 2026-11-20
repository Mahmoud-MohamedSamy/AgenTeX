const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_jam-4ca9d5fe/out/';
const r1 = JSON.parse(fs.readFileSync(OUT + 'r1.json', 'utf8')); const o = {};
o.delCS = [(await api('DELETE', '/modules/' + TK + '/records/' + r1.A)).s, (await api('DELETE', '/modules/' + TK + '/records/' + r1.B)).s];
o.prefsBefore = (await api('GET', '/desk/departments/' + DB + '/round-robin-preferences')).j?.data;
o.tu1Open = (((await api('GET', '/desk/agents/' + TU1 + '/workload')).j?.data?.departments || []).find(d => d.department_id === DB) || {}).open_tickets;
o.rules = ((await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + DB)).j?.data?.rules || []).filter(r => r.is_active).map(r => r.name);
fs.writeFileSync(OUT + 'r2.json', JSON.stringify(o, null, 1)); log(o);
