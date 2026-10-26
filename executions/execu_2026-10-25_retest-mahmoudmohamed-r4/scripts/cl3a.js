// Read-only inventory of the CRM bin.
const all = []; let cur = ''; for (let i = 0; i < 40; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); const a = arr(r.j?.data); all.push(...a); cur = r.j?.meta?.next_cursor; if (!cur || !a.length) break; }
return done(all.map(x => ({ id: x.id, label: x.record_label, module: x.module_label || x.module_key || x.entity_type, by: x.deleted_by_name || x.deleted_by, at: x.deleted_at })));
