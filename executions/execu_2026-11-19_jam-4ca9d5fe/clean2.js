const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_jam-4ca9d5fe/out/'; const o = JSON.parse(fs.readFileSync(OUT + 's1.json', 'utf8'));
const res = {};
for (const k of Object.keys(o)) { if (typeof o[k] !== 'string' || k === 'rule') continue; res[k] = (await api('DELETE', '/modules/' + TK + '/records/' + o[k])).s; }
res.rule = (await api('DELETE', '/desk/assignment-rules/' + o.rule)).s;
const before = JSON.parse(fs.readFileSync(OUT + 'r2.json', 'utf8')).prefsBefore;
res.prefsPut = (await api('PUT', '/desk/departments/' + DB + '/round-robin-preferences', before)).s;
const now = (await api('GET', '/desk/departments/' + DB + '/round-robin-preferences')).j?.data; res.prefsSame = JSON.stringify(now) === JSON.stringify(before);
await sleep(3000); let ids = [], cur = null;
do { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200' + (cur ? '&cursor=' + cur : '')); for (const x of arr(r.j)) if (/^QA (JAM2|NORULE)/.test(x.record_label || '')) ids.push(x.id); cur = r.j?.meta?.next_cursor; } while (cur);
res.binFound = ids.length; for (let i = 0; i < ids.length; i += 25) res['purge' + i] = (await api('POST', '/audit/recycle-bin/delete', { ids: ids.slice(i, i + 25) })).s;
res.tu1Open = (((await api('GET', '/desk/agents/' + TU1 + '/workload')).j?.data?.departments || []).find(d => d.department_id === DB) || {}).open_tickets;
log(res);
