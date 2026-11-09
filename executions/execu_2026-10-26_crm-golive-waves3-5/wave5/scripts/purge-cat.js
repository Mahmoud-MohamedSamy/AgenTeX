const r = await call('GET', '/audit/recycle-bin/items?limit=200'); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.items;
const it = d.filter(x => x.module_key === 'skill_category' && /QA W5/.test(x.record_label || ''));
const p = it.length ? await call('POST', '/audit/recycle-bin/delete', { ids: it.map(x => x.id) }) : null; return { found: it.length, purge: p && (p.s + ' ' + p.t.slice(0, 120)) };
