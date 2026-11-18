const B = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/';
const ids = JSON.parse(fs.readFileSync(B + 'ids2.json', 'utf8')); const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const n = (await api('GET', '/desk/assignment/notification-settings')).j?.data;
log({ switchOff: (await api('PUT', '/desk/assignment/notification-settings', { ...n, direct_rules_enabled: false })).s });
const L = (await api('GET', '/desk/assignment-rules?type=direct')).j?.data?.rules || []; const R = L.find(r => r.id === ids.rule);
log({ deact: (await api('PUT', '/desk/assignment-rules/' + ids.rule + '/active', { is_active: false, version: R?.version })).s, del: (await api('DELETE', '/desk/assignment-rules/' + ids.rule)).s });
log({ formDel: (await api('DELETE', '/web-forms/' + ids.form + '?app=desk')).s });
log({ ticketDel: (await api('DELETE', '/modules/' + T + '/records/a0fb0937-79c3-471a-b84c-b93bcdbbbf27')).s });
await sleep(3000);
let all = [], cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j?.meta?.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA RT22/.test(x.record_label || '')); log('bin', mine.map(x => x.record_label));
if (mine.length) log('purge', (await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id) })).s);
const n2 = (await api('GET', '/desk/assignment/notification-settings')).j?.data; log({ after: n2, same: JSON.stringify(n2) === JSON.stringify(ids.notifBefore) });
log({ rulesLeft: ((await api('GET', '/desk/assignment-rules?type=direct')).j?.data?.rules || []).filter(r => /QA RT22/.test(r.name)).length, formsLeft: arr((await api('GET', '/web-forms?app=desk')).j).filter(f => /QA RT22/.test(f.name)).length });
