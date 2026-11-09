const all = []; let cur = null;
for (let p = 0; p < 20; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = (r.j.data && (r.j.data.items || r.j.data)) || []; all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; }
const hits = all.filter(x => /QA W5/i.test(JSON.stringify(x)));
return { total: all.length, hits: hits.map(x => ({ id: x.id, mk: x.module_key, et: x.entity_type, label: x.record_label, rid: x.record_id, app: x.app_key })) , sampleKeys: Object.keys(all[0] || {}) };
