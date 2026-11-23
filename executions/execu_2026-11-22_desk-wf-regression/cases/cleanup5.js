// Cleanup of the 23 Nov fail retest (rt1, rt2): everything named "QA WF RT…".
const out = {}; const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => /"QA WF RT/.test(l));
const ids = re => [...new Set(LG.filter(l => re.test(l)).map(l => (l.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/) || [])[1]).filter(Boolean))];
const del = async (path, list) => { let ok = 0, gone = 0, err = []; for (const id of list) { const d = await api('DELETE', path + id); if (d.s < 300) ok++; else if (d.s === 404) gone++; else err.push(id.slice(0, 8) + ' ' + d.s); } return { ok, gone, of: list.length, err }; };
out.rules = await del('/workflow/rules/', (await allRules()).filter(r => /^QA WF /.test(r.name)).map(r => r.id));
out.tickets = await del(`/modules/${T}/records/`, ids(/ ticket "QA WF RT/));
out.ar = await del('/desk/assignment-rules/', ids(/assignment rule "QA WF RT/));
await sleep(8000);
let purged = 0; for (let p = 0; p < 10; p++) { const items = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data); const qa = items.filter(i => /QA WF/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!qa.length) break; const d = await api('POST', '/audit/recycle-bin/delete', { ids: qa.slice(0, 50).map(i => i.id) }); if (d.s >= 300) { out.binErr = d.s; break; } purged += Math.min(50, qa.length); await sleep(3000); }
out.binPurged = purged;
out.verify = { qaRulesLeft: (await allRules()).filter(r => /^QA WF /.test(r.name)).length, activeRules: (await allRules()).filter(r => r.isActive).map(r => r.name),
  binLeft: arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label]))).length,
  arLeft: [...arr((await api('GET', '/desk/assignment-rules?type=direct&department_id=' + DEPT2)).j?.data), ...arr((await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + DEPT2)).j?.data)].filter(r => /QA WF/.test(r.name)).length,
  directSwitch: ((await api('GET', '/desk/assignment/notification-settings')).j?.data || {}).direct_rules_enabled };
ledger('CLEANUP rt ' + JSON.stringify(out).slice(0, 600));
return out;
