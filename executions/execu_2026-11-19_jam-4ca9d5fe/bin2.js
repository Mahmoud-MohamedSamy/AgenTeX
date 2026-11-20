let ids = [], n = 0, cur = null, sample = null;
do { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200' + (cur ? '&cursor=' + cur : '')); for (const x of arr(r.j)) { n++; if (!sample) sample = Object.keys(x); const s = JSON.stringify(x); if (/QA (JAM2|NORULE)/.test(s)) ids.push(x.id); } cur = r.j?.meta?.next_cursor; } while (cur);
log({ total: n, matched: ids.length, keys: sample });
const p = []; for (let i = 0; i < ids.length; i += 25) p.push((await api('POST', '/audit/recycle-bin/delete', { ids: ids.slice(i, i + 25) })).s); log({ purge: p });
