const o = {}; const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&q=QA%20RT21%20SC'); const items = arr(r.j && r.j.data); o.s = r.s; o.n = items.length;
const mine = items.filter(x => /QA RT21 SC/.test(JSON.stringify(x))); o.mine = mine.map(x => [x.id, x.display_name || x.name]);
if (mine.length) { const p = await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id) }); o.purge = [p.s, p.t.slice(0, 300)]; LED('CLEANUP purged (crm): ' + mine.map(x => x.id).join(', ')); }
const r2 = await api('GET', '/audit/recycle-bin/items?app_key=crm&q=QA%20RT21%20SC'); o.after = arr(r2.j && r2.j.data).filter(x => /QA RT21 SC/.test(JSON.stringify(x))).length + ' of ' + arr(r2.j && r2.j.data).length;
return o;
