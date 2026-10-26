const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const items = []; let cursor = null;
for (let p = 0; p < 20; p++) { const r = await call('GET', `/audit/recycle-bin/items?limit=200${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`); const d = (Array.isArray(r.j.data) ? r.j.data : r.j.data.items) || []; items.push(...d); cursor = r.j.meta && r.j.meta.next_cursor; if (!cursor) break; }
const mine = items.filter(i => i.deleted_by === OWNER && i.deleted_at >= '2026-10-25T20:40' && (/^QA W2/.test(i.record_label || '') || (i.module_key === 'contacts' && !i.record_label && i.deleted_at < '2026-10-25T21:00')));
const others = items.filter(i => i.deleted_at >= '2026-10-25T20:40' && !mine.includes(i)).map(i => i.module_key + ':' + (i.record_label || '(no name)') + ':' + i.deleted_by_label);
const res = []; for (let k = 0; k < mine.length; k += 50) { const d = await call('POST', '/audit/recycle-bin/delete', { ids: mine.slice(k, k + 50).map(i => i.id) }); res.push(d.s + ' ok=' + (d.j.data.succeeded || []).length + ' failed=' + (d.j.data.failed || []).length); }
return { total: items.length, qaItems: mine.length, labels: mine.map(i => i.module_key + ':' + (i.record_label || '(no name)')).slice(0, 60), res, notTouched: others.slice(0, 20) };
