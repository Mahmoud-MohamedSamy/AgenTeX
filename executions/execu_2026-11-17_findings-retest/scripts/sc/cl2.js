const o = {};
const g = await api('GET', '/reporting/reports/' + I.rep); const rev = g.j && g.j.data && ((g.j.data.data || g.j.data).revision); o.repDel = (await api('DELETE', '/reporting/reports/' + I.rep + '?expected_revision=' + rev)).s; LED('CLEANUP report ' + I.rep + ' deleted (' + o.repDel + ')');
o.r1Del = (await api('DELETE', '/scoring-rules/' + I.R1)).s; LED('CLEANUP scoring rule R1 ' + I.R1 + ' deleted (' + o.r1Del + ')');
for (const k of ['A', 'C']) { o['del' + k] = (await api('DELETE', '/modules/' + L + '/records/' + I[k])).s; LED('CLEANUP lead ' + k + ' ' + I[k] + ' deleted (' + o['del' + k] + ')'); }
await sleep(3000);
let items = []; for (let p = 1; p <= 10; p++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&page=' + p); const a = arr(r.j && r.j.data); items = items.concat(a); if (a.length < 50) break; }
const mine = items.filter(x => /QA RT21 SC/.test(JSON.stringify(x))); o.binMine = mine.map(x => [x.id, x.display_name || x.name || x.label]);
if (mine.length) { const p = await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id) }); o.purge = [p.s, p.t.slice(0, 300)]; LED('CLEANUP purged (crm): ' + mine.map(x => x.id).join(', ')); }
// verify
o.vRule = (await getRule(I.R1)).s; o.vRep = (await api('GET', '/reporting/reports/' + I.rep)).s;
o.vA = (await api('GET', '/modules/' + L + '/records/' + I.A)).s; o.vC = (await api('GET', '/modules/' + L + '/records/' + I.C)).s;
o.vRulesLeft = (await listRules()).filter(r => /QA RT21 SC/.test(r.name)).map(r => r.name);
let items2 = []; for (let p = 1; p <= 10; p++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&page=' + p); const a = arr(r.j && r.j.data); items2 = items2.concat(a); if (a.length < 50) break; }
o.vBin = items2.filter(x => /QA RT21 SC/.test(JSON.stringify(x))).length + ' of ' + items2.length;
o.vCur = (await api('GET', '/currencies')).j.data.currencies.length;
return o;
