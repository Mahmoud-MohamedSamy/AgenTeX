const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const before = JSON.parse(fs.readFileSync(OUT + 'statuses-before-typechange.json', 'utf8'));
log({ restore: (await api('PUT', '/desk/ticket-statuses', { statuses: before })).s });
const now = (await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []; log({ identicalToOriginal: JSON.stringify(now) === JSON.stringify(before) });
const hc = JSON.parse(fs.readFileSync(OUT + 'hc.json', 'utf8'));
for (const [k, v] of Object.entries(hc.t)) log('del #' + v.n, (await api('DELETE', '/modules/' + TK + '/records/' + v.id)).s);
await sleep(4000);
let all = [], cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j?.meta?.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA ST /.test(x.record_label || '')); log({ binItems: mine.length });
for (let i = 0; i < mine.length; i += 25) log({ purge: (await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) })).s });
const seen = []; let tp = 1; for (let i = 1; i <= tp && i <= 15; i++) { const r = await api('GET', '/modules/' + TK + '/records?page_size=100&page=' + i); tp = r.j?.meta?.total_pages || tp; for (const x of arr(r.j)) { const s = ((x.data || []).find(f => f.field === 'subject') || {}).value?.value || ''; if (/^QA ST /.test(s)) seen.push(s); } }
log({ qaStTicketsLeft: seen.length, slaPoliciesLeft: arr((await api('GET', '/desk/sla/policies?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158')).j).filter(p => /QA ST/.test(p.name)).length });
