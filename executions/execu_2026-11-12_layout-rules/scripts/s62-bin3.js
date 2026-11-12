const out = {}; const f = await api('GET', '/audit/recycle-bin/facets'); out.mods = arr(f.j.data.modules).map(m => m.module_key + ':' + m.count).join(' ');
const r = await api('GET', '/audit/recycle-bin/items?module_key=field&limit=50'); out.field = arr(r.j.data && (r.j.data.items || r.j.data)).filter(i => /qa_lr|QA LR/i.test(i.record_label)).map(i => i.id + ' ' + i.module_key + ' ' + i.record_label);
return out;
