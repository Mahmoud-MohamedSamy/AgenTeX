const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/';
const rows = ['tickets.jsonl', 'tickets2.jsonl', 'tickets3.jsonl'].flatMap(f => { try { return fs.readFileSync(OUT + f, 'utf8').split(String.fromCharCode(10)).filter(Boolean).map(l => JSON.parse(l)); } catch (e) { return []; } }).filter(r => r.id);
const L = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.events)) || [];
for (const name of ['QA NDC Finance team after Validation', 'QA NDC Not Approved E-Top-Up Manager']) {
  const r = rows.find(x => x.status === name); const h = L((await api('GET', '/desk/tickets/' + r.id + '/history')).j?.data);
  log({ name, history: h.slice(0, 8).map(e => (e.created_at || e.at || '').slice(11, 19) + ' ' + (e.action || e.event) + ' ' + (e.actor_name || e.actor?.name || e.actor_type || '') + ' ' + JSON.stringify(e.changes || e.details || '').slice(0, 220)) });
}
const W = (await api('GET', '/desk/agents/3445ec4a-020e-4f12-b156-dd2de7610164/workload')).j?.data; log({ wlKeys: Object.keys(W || {}), sample: JSON.stringify(W).slice(0, 400) });
