const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/';
const before = JSON.parse(fs.readFileSync(OUT + 'statuses-before-typechange.json', 'utf8')); const now = (await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || [];
log({ identical: JSON.stringify(before) === JSON.stringify(now), diff: now.filter((s, i) => JSON.stringify(s) !== JSON.stringify(before[i])).map(s => s.value) });
const o = JSON.parse(fs.readFileSync(OUT + 'tc.json', 'utf8')); const s = (await api('GET', '/desk/tickets/' + o.t.C1 + '/sla')).j?.data || {};
log({ C1cycles: (s.obligations || []).map(x => x.kind + ' cycle=' + x.cycle + ' ' + x.state + ' started=' + (x.started_at || '').slice(11, 19)) });
