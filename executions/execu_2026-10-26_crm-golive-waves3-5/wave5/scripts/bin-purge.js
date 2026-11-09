const all = []; let cur = null; for (let p = 0; p < 20; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; }
const qa = all.filter(x => /QA W5/i.test(x.record_label || '') || /qa_w5/.test(x.module_key || ''));
const p = await call('POST', '/audit/recycle-bin/delete', { ids: qa.map(x => x.id) });
const res = p.j && p.j.data; return { tried: qa.length, status: p.s, succeeded: res && res.succeeded && res.succeeded.length, failed: res && res.failed && res.failed.slice(0, 3), failedCount: res && res.failed && res.failed.length };
