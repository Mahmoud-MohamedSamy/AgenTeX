const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); };
const get = async () => arr(D((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&limit=200&q=' + encodeURIComponent('QA AC'))).j)).filter(x => /(^|#\d+ )QA AC /.test(x.record_label || ''));
let mine = await get(); out.found = mine.length; out.labels = mine.map(x => x.record_label).join(' | ').slice(0, 900);
out.purge = []; for (let i = 0; i < mine.length; i += 25) out.purge.push(await pr('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) }));
out.left = (await get()).length;
return fin({ out });
