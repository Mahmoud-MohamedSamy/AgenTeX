const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_jam-4ca9d5fe/out/'; const o = JSON.parse(fs.readFileSync(OUT + 'r3.json', 'utf8')); const r2 = JSON.parse(fs.readFileSync(OUT + 'r2.json', 'utf8'));
const L = (await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + DB)).j?.data?.rules || []; const R = L.find(r => r.id === o.rule);
log({ deact: (await api('PUT', '/desk/assignment-rules/' + o.rule + '/active', { is_active: false, version: R?.version })).s, del: (await api('DELETE', '/desk/assignment-rules/' + o.rule)).s });
for (const id of [o.Aown, o.Aback]) log('del', (await api('DELETE', '/modules/' + TK + '/records/' + id)).s);
log({ prefsRestore: (await api('PUT', '/desk/departments/' + DB + '/round-robin-preferences', r2.prefsBefore)).s });
const now = (await api('GET', '/desk/departments/' + DB + '/round-robin-preferences')).j?.data; log({ prefsSame: JSON.stringify(now) === JSON.stringify(r2.prefsBefore) });
await sleep(3000);
let all = [], cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j?.meta?.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA JAM /.test(x.record_label || '')); log({ bin: mine.map(x => x.record_label) }); if (mine.length) log({ purge: (await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id) })).s });
log({ tu1Open: (((await api('GET', '/desk/agents/' + TU1 + '/workload')).j?.data?.departments || []).find(d => d.department_id === DB) || {}).open_tickets });
