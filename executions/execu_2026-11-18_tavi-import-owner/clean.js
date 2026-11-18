const ids = ['33410d1e-3399-431b-9f25-26b880ac5312', '737209e6-2bbc-4240-bbf8-ce814802e618', '50437141-7b37-4be1-b688-075c6c4c7a91'];
for (const id of ids) log('del', id.slice(0, 8), (await api('DELETE', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + id)).s);
await sleep(3000);
let all = [], cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA RT22/.test(x.record_label || '')); log('bin', mine.map(x => x.record_label));
if (mine.length) log('purge', (await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id) })).s);
for (const id of ids) log('get', id.slice(0, 8), (await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + id)).s);
