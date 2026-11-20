const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/';
const seen = new Map(); let tp = 1;
for (let i = 1; i <= tp && i <= 30; i++) { const r = await api('GET', '/modules/' + TK + '/records?page_size=100&page=' + i); tp = r.j?.meta?.total_pages || tp; for (const x of arr(r.j)) seen.set(x.id, ((x.data || []).find(f => f.field === 'status') || {}).value?.value || '?'); }
const cnt = {}; for (const s of seen.values()) cnt[s] = (cnt[s] || 0) + 1;
fs.writeFileSync(OUT + 'status-usage.json', JSON.stringify({ n: seen.size, pages: tp, cnt }, null, 1)); log({ unique: seen.size, total_pages: tp, cnt });
