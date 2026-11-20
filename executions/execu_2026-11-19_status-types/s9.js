const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const B = '3445ec4a-020e-4f12-b156-dd2de7610164', MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
const m2 = JSON.parse(fs.readFileSync(OUT + 'measure2.json', 'utf8')); const rows = ['tickets.jsonl', 'tickets2.jsonl', 'tickets3.jsonl'].flatMap(f => { try { return fs.readFileSync(OUT + f, 'utf8').split(String.fromCharCode(10)).filter(Boolean).map(l => JSON.parse(l)); } catch (e) { return []; } }).filter(r => r.id);
for (const x of m2.filter(x => x.desk !== x.status)) { const r = rows.find(y => y.status === x.status); const t = (await api('GET', '/desk/tickets/' + r.id)).j?.data || {}; log({ status: x.status, deskNow: t.status, closed_at: t.closed_at ? 'set' : '-' }); }
const sv = v => ({ kind: 'string', value: String(v) }); const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const c = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA ST bank deposit retry', description: 'QA ST', department: MK, status: 'Open', priority: 'medium' }) }); const id = c.j?.data?.id;
const p = await api('PATCH', '/modules/' + TK + '/records/' + id, { data: fields({ status: 'QA NDC Bank deposit request' }) }); log({ create: c.s, move: p.s, err: p.s >= 300 ? p.t.slice(0, 300) : undefined });
const p2 = await api('PATCH', '/modules/' + TK + '/records/' + id, { data: fields({ status: 'QA NDC Operation Management' }) }); log({ controlMoveSameTicket: p2.s });
fs.writeFileSync(OUT + 'bank.json', JSON.stringify({ id }));
