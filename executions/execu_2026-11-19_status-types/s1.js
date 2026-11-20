const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/';
const B = '3445ec4a-020e-4f12-b156-dd2de7610164';
const ctx = JSON.parse(fs.readFileSync(OUT + 'ctx.json', 'utf8')); const st = JSON.parse(fs.readFileSync(OUT + 'statuses.json', 'utf8')); const T = Object.fromEntries(st.map(s => [s.value, s.type]));
const deps = (await api('GET', '/desk/departments')).j?.data; const D = Array.isArray(deps) ? deps : (deps?.departments || []);
log({ Bdepts: D.filter(d => (d.agent_user_ids || []).includes(B)).map(d => d.id.slice(0, 8) + ' ' + d.name + ' layout=' + (d.layout_id || d.default_layout_id || '?')) });
const per = {};
for (const l of ctx.layouts) { const r = await api('GET', '/modules/' + TK + '/layouts/' + l.id + '/ticket-statuses'); const L = r.j?.data?.statuses || arr(r.j?.data) || []; per[l.name] = { s: r.s, n: L.length, values: L.map(x => x.value + ':' + (x.type || '?') + (x.type && T[x.value] && x.type !== T[x.value] ? '!=tenant:' + T[x.value] : '')) }; }
fs.writeFileSync(OUT + 'layout-statuses.json', JSON.stringify(per, null, 1));
for (const [k, v] of Object.entries(per)) log(k + ' ' + v.s + ' n=' + v.n + ' ' + v.values.join(', ').slice(0, 400));
