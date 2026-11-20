const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const first = arr((await api('GET', '/modules/' + TK + '/records?limit=100')).j).map(x => x.id);
for (const q of ['page=2&page_size=100', 'page=2&limit=100', 'offset=100&limit=100', 'skip=100&limit=100', 'limit=1000']) { const r = await api('GET', '/modules/' + TK + '/records?' + q); const L = arr(r.j); log({ q, s: r.s, n: L.length, overlap: L.filter(x => first.includes(x.id)).length, meta: JSON.stringify(r.j?.meta || {}).slice(0, 200) }); }
