const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const o = JSON.parse(fs.readFileSync(OUT + 'tc.json', 'utf8'));
const B = '3445ec4a-020e-4f12-b156-dd2de7610164', MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
const snap = { tag: process.env.TAG, at: new Date().toISOString().slice(11, 19), type: ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).find(x => x.value === 'QA NDC Distributor')?.type };
snap.workload = (((await api('GET', '/desk/agents/' + B + '/workload')).j?.data?.departments || []).find(d => d.department_id === MK) || {}).open_tickets;
for (const [k, id] of Object.entries(o.t)) { const t = (await api('GET', '/desk/tickets/' + id)).j?.data || {}; const s = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data || {}; snap[k] = { status: t.status, closed_at: t.closed_at ? t.closed_at.slice(11, 19) : '-', sla: (s.obligations || []).map(x => x.kind + ':' + x.state + ':' + (x.remaining_seconds ?? '-')).join(' ') || s.state }; }
fs.appendFileSync(OUT + 'tc-snaps.jsonl', JSON.stringify(snap) + '\n'); log(snap);
