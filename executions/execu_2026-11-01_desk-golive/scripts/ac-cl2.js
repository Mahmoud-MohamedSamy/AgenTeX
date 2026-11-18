const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); };
out.teams = [await pr('DELETE', '/desk/teams/' + TEAM), await pr('DELETE', '/desk/teams/caf9df21-1fd5-49b5-8248-f09a64c8b4c6')];
let items = [], cur = ''; for (let i = 0; i < 6; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&app_key=desk&app_key=iam&limit=200' + (cur ? '&cursor=' + cur : '')); const d = D(r.j); const L = arr(d); items.push(...L); cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur) break; }
const mine = items.filter(x => /^QA AC /.test(x.record_label || x.label || '')); out.binMine = mine.length; out.binTotalSeen = items.length;
out.purge = []; for (let i = 0; i < mine.length; i += 25) out.purge.push(await pr('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) }));
return fin({ out });
