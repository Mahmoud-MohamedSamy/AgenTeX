const B = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/';
const ids = JSON.parse(fs.readFileSync(B + 'ids3.json', 'utf8')); const rows = JSON.parse(fs.readFileSync(B + 'tavi-rows4.json', 'utf8')); const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const wfG = (await api('GET', '/workflow/rules/' + ids.wf)).j?.data; log({ wfDeact: (await api('PATCH', '/workflow/rules/' + ids.wf, { ...(wfG || {}), isActive: false })).s, wfDel: (await api('DELETE', '/workflow/rules/' + ids.wf)).s });
const L = (await api('GET', '/desk/assignment-rules?type=round_robin&department_id=4853562a-0b4d-45cb-ba34-9f2118fcd32c')).j?.data?.rules || []; const R = L.find(r => r.id === ids.rr);
log({ rrDeact: (await api('PUT', '/desk/assignment-rules/' + ids.rr + '/active', { is_active: false, version: R?.version })).s, rrDel: (await api('DELETE', '/desk/assignment-rules/' + ids.rr)).s });
for (const id of [...Object.values(ids.manual), ...rows.map(r => r.id)]) log('del', id.slice(0, 8), (await api('DELETE', '/modules/' + T + '/records/' + id)).s);
await sleep(3000);
let all = [], cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=workflow&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j?.meta?.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA RT22/.test(x.record_label || '')); log('bin', mine.map(x => x.record_label));
if (mine.length) log('purge', (await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id) })).s);
log({ prefsSame: JSON.stringify((await api('GET', '/desk/departments/4853562a-0b4d-45cb-ba34-9f2118fcd32c/round-robin-preferences')).j?.data) === JSON.stringify(ids.prefsBefore), wfLeft: (await api('GET', '/workflow/rules/' + ids.wf)).s, rrLeft: ((await api('GET', '/desk/assignment-rules?type=round_robin&department_id=4853562a-0b4d-45cb-ba34-9f2118fcd32c')).j?.data?.rules || []).filter(r => /QA RT22/.test(r.name)).length });
