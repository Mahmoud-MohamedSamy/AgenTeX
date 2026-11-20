const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const s7 = JSON.parse(fs.readFileSync(OUT + 'step7.json', 'utf8'));
const L = arr((await api('GET', '/modules/' + TK + '/records?limit=100')).j).filter(x => x.created_at > '2026-11-19T07:30');
const ids = []; for (const x of L) { const d = (await api('GET', '/modules/' + TK + '/records/' + x.id)).j?.data?.data || []; const s = (d.find(f => f.field === 'subject') || {}).value?.value || ''; if (/^QA ST /.test(s)) ids.push(x.id); }
let ok = 0; for (const id of ids) { const r = await api('DELETE', '/modules/' + TK + '/records/' + id); if (r.s === 204) ok++; } log({ found: ids.length, deleted: ok });
log({ slaDel: (await api('DELETE', '/desk/sla/policies/' + s7.sla)).s });
await sleep(4000);
let all = [], cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j?.meta?.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA ST /.test(x.record_label || '')); log({ bin: mine.length });
for (let i = 0; i < mine.length; i += 25) log({ purge: (await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) })).s });
const L2 = arr((await api('GET', '/modules/' + TK + '/records?limit=100')).j).filter(x => x.created_at > '2026-11-19T07:30'); let left = 0; for (const x of L2) { const d = (await api('GET', '/modules/' + TK + '/records/' + x.id)).j?.data?.data || []; if (/^QA ST /.test((d.find(f => f.field === 'subject') || {}).value?.value || '')) left++; }
log({ ticketsLeft: left, slaLeft: arr((await api('GET', '/desk/sla/policies?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158')).j).filter(p => /QA ST/.test(p.name)).length, wl: (((await api('GET', '/desk/agents/3445ec4a-020e-4f12-b156-dd2de7610164/workload')).j?.data?.departments || []).find(d => d.department_id === '2a73bbc0-efb3-4250-bf9b-2fdc98236794') || {}).open_tickets });
