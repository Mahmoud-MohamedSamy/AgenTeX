const today = new Date().toISOString().slice(0, 10); const left = []; let cursor = null;
for (let i = 0; i < 30; i++) {
  const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''));
  const d = (r.j && (Array.isArray(r.j.data) ? r.j.data : r.j.data && r.j.data.items)) || [];
  for (const x of d) if (/^QA (AEO|W3) /.test(String(x.record_label || '')) && String(x.deleted_at || '').startsWith(today)) left.push(x.id);
  cursor = r.j && r.j.meta && r.j.meta.next_cursor; if (!cursor || !d.length) break;
}
let purged = null;
if (left.length) purged = (await call('POST', '/audit/recycle-bin/delete', { ids: left.slice(0, 50) })).s;
return { left: left.length, purged };
