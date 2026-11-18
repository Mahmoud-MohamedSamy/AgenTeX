const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const o = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/bpmid.json', 'utf8'));
log({ bpOff: (await api('PATCH', `/modules/${TK}/blueprints/${o.bp}`, { isActive: false })).s });
for (const [k, id] of Object.entries(o.tickets)) log('del', k, (await api('DELETE', '/modules/' + TK + '/records/' + id)).s);
log({ bpDel: (await api('DELETE', `/modules/${TK}/blueprints/${o.bp}`)).s });
log({ slaDel: (await api('DELETE', '/desk/sla/policies/' + o.sla)).s });
await sleep(3000);
let all = [], cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=workflow&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j?.meta?.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA RT22/.test(x.record_label || '')); log('bin', mine.map(x => x.record_label));
if (mine.length) log('purge', (await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id) })).s);
log({ bpLeft: (await api('GET', `/modules/${TK}/blueprints/${o.bp}`)).s, slaLeft: arr((await api('GET', '/desk/sla/policies?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158')).j).filter(p => /QA RT22/.test(p.name)).length });
for (const id of Object.values(o.tickets)) log('get', (await api('GET', '/modules/' + TK + '/records/' + id)).s);
