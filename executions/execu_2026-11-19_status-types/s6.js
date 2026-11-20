const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const rows = ['tickets.jsonl', 'tickets2.jsonl', 'tickets3.jsonl'].flatMap(f => { try { return fs.readFileSync(OUT + f, 'utf8').split(String.fromCharCode(10)).filter(Boolean).map(l => JSON.parse(l)); } catch (e) { return []; } }).filter(r => r.id);
const keep = new Set(rows.map(r => r.id));
const L = arr((await api('GET', '/modules/' + TK + '/records?limit=100')).j).filter(x => x.created_at > '2026-11-19T07:30');
const orphans = []; for (const x of L) { if (keep.has(x.id)) continue; const d = (await api('GET', '/modules/' + TK + '/records/' + x.id)).j?.data?.data || []; const o = {}; for (const f of d) o[f.field] = f.value?.value; if (/^QA ST /.test(o.subject || '')) orphans.push({ id: x.id, subj: o.subject, status: o.status, dept: (o.department || '').slice(0, 8) }); }
fs.writeFileSync(OUT + 'orphans.json', JSON.stringify(orphans, null, 1)); log({ recent: L.length, orphans });
