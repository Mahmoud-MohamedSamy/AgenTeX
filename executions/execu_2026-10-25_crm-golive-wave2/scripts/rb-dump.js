const items = []; let cursor = null; let pages = 0; let first = null;
do {
  const r = await call('GET', `/audit/recycle-bin/items?limit=200${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`);
  if (r.s !== 200) return { err: r.s, t: r.t, pages, n: items.length };
  const d = Array.isArray(r.j.data) ? r.j.data : (r.j.data.items || []);
  if (!first && d[0]) first = Object.keys(d[0]);
  for (const x of d) items.push(x);
  cursor = r.j.meta && r.j.meta.next_cursor; pages++;
} while (cursor && pages < 100);
const facets = await call('GET', '/audit/recycle-bin/facets');
return { count: items.length, pages, keys: first, facets: facets.j && facets.j.data, items };
