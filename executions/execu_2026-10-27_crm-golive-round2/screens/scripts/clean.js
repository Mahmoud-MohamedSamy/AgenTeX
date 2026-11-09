const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
out.steps = [];
// delete the hand-made perf lead (has all the attachments) + any QA R2SC lead still in the modules
const del = async id => { const s = await api('DELETE', `/modules/${L}/records/${id}`); return s.s; };
for (const id of ['63a27a2d-8b88-4cd0-a74b-1e5e3afcd632']) out.steps.push('del perf ' + id + ' -> ' + await del(id));
// scan newest leads for any QA R2SC leftover
const r = await api('GET', `/modules/${L}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`);
const qa = (r.j.data || []).filter(x => JSON.stringify(x.data || '').includes('QA R2SC'));
for (const x of qa) out.steps.push('del leftover ' + x.id + ' -> ' + await del(x.id));
// purge QA R2SC bin items (up to 5 pages)
let cur = null, items = [];
for (let p = 0; p < 6; p++) { const b = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : ''));
  const d = Array.isArray(b.j.data) ? b.j.data : (b.j.data.items || []); items.push(...d.filter(i => JSON.stringify(i).includes('QA R2SC')).map(i => i.id)); cur = b.j.meta && b.j.meta.next_cursor; if (!cur || !d.length) break; }
for (let i = 0; i < items.length; i += 50) out.steps.push('purge ' + Math.min(50, items.length - i) + ' -> ' + (await api('POST', '/audit/recycle-bin/delete', { ids: items.slice(i, i + 50) })).s);
out.purged = items.length;
