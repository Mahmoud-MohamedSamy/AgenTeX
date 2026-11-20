const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const o = JSON.parse(fs.readFileSync(OUT + 'step7.json', 'utf8'));
const TAG = process.env.TAG || 'now'; const snap = { at: new Date().toISOString() };
for (const [s, id] of Object.entries(o.slaT)) { const d = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data || {}; const t = (await api('GET', '/desk/tickets/' + id)).j?.data || {};
  snap[s] = { deskStatus: t.status, state: d.state, execution: d.execution, obligations: (d.obligations || []).map(x => ({ kind: x.kind || x.type, due: x.due_at || x.due, status: x.status || x.state, paused: x.paused ?? x.is_paused, remaining: x.remaining_seconds ?? x.remaining })) }; }
fs.writeFileSync(OUT + 'sla-' + TAG + '.json', JSON.stringify(snap, null, 1)); log(JSON.stringify(snap).slice(0, 3000));
