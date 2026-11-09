const r = await call('GET', '/reporting/reports'); const d = r.j.data.data || r.j.data; const items = Array.isArray(d) ? d : (d.items || []);
const qa = items.filter(x => /QA R2W5|Untitled joined/.test(x.name)).map(x => ({ id: x.id, name: x.name, rev: x.revision }));
const res = { qa };
const one = qa.find(x => /rollup \d+|sched \d+/.test(x.name));
if (one) { const d1 = await call('DELETE', '/reporting/reports/' + one.id); res.plainDelete = d1.s + ' ' + d1.t.slice(0, 250); }
const j = await call('GET', '/reporting/joined-reports'); res.joined = j.s + ' ' + j.t.slice(0, 300);
const dsh = await call('GET', '/reporting/dashboards'); res.dash = dsh.t.slice(0, 300);
const sc = await call('GET', '/reporting/schedules'); res.sched = sc.t.slice(0, 400);
return res;
