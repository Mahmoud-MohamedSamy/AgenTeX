const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); };
const scan = async () => { let items = [], cur = '', pages = 0; for (let i = 0; i < 25; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&app_key=desk&app_key=iam&app_key=files&app_key=workflow&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); items.push(...arr(D(r.j))); pages++; cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur) break; } return { items, pages }; };
let s = await scan(); let mine = s.items.filter(x => /^QA AC /.test(x.record_label || '')); out.first = { seen: s.items.length, pages: s.pages, mine: mine.length, labels: mine.map(x => x.record_label).join(' | ').slice(0, 600) };
out.purge = []; for (let i = 0; i < mine.length; i += 25) out.purge.push(await pr('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) }));
s = await scan(); out.left = s.items.filter(x => /^QA AC /.test(x.record_label || '')).length;
out.tix = []; for (const id of Object.values(TK)) out.tix.push((await api('GET', '/modules/' + TM + '/records/' + id)).s); out.tix = [...new Set(out.tix)].join(',');
return fin({ out });
