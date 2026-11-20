const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const B = '3445ec4a-020e-4f12-b156-dd2de7610164', MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const o = { t: {} };
for (const s of ['QA NDC Reject', 'QA NDC Refund rejected']) { const c = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA ST RJ ' + s, description: 'QA ST', department: MK, status: 'Open', priority: 'medium', owner: B }) }); const id = c.j?.data?.id; o.t[s] = id;
  const p = await api('PATCH', '/modules/' + TK + '/records/' + id, { data: fields({ status: s }) }); o[s] = { move: p.s, err: p.s >= 300 ? JSON.stringify(p.j?.error) : undefined };
  if (p.s < 300) { await sleep(10000); const t = (await api('GET', '/desk/tickets/' + id)).j?.data || {}; o[s].desk = t.status; o[s].closed_at = t.closed_at ? 'set' : '-'; } }
fs.writeFileSync(OUT + 'rj.json', JSON.stringify(o, null, 1)); log(o);
