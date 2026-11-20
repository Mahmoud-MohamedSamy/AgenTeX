const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const rows = ['tickets.jsonl', 'tickets2.jsonl', 'tickets3.jsonl'].flatMap(f => { try { return fs.readFileSync(OUT + f, 'utf8').split(String.fromCharCode(10)).filter(Boolean).map(l => JSON.parse(l)); } catch (e) { return []; } }).filter(r => r.id);
const out = [];
for (const r of rows) { const d = (await api('GET', '/modules/' + TK + '/records/' + r.id)).j?.data?.data || []; const rs = (d.find(f => f.field === 'status') || {}).value?.value; const t = (await api('GET', '/desk/tickets/' + r.id)).j?.data || {}; out.push({ status: r.status, type: r.type, record: rs, desk: t.status, closed_at: t.closed_at ? 'set' : '' }); }
fs.writeFileSync(OUT + 'measure2.json', JSON.stringify(out, null, 1));
log(out.filter(x => x.record !== x.status || x.desk !== x.status));
log({ deskEqualsRecord: out.filter(x => x.record === x.desk).length + '/' + out.length });
