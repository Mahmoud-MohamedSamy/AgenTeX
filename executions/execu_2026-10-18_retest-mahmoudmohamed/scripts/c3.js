// Cleanup step 3 (read-only): QA RT items in the Recycle Bin and the item shape.
const q = 'app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200';
const r = await api('GET', '/audit/recycle-bin/items?' + q);
const items = arr(r.j && r.j.data); const qa = items.filter(x => /QA RT/.test(JSON.stringify(x)));
return done({ s: r.s, total: items.length, meta: JSON.stringify(r.j && r.j.meta).slice(0, 200), qa: qa.length, first: JSON.stringify(qa[0] || items[0]).slice(0, 700), names: qa.map(x => (x.display_name || x.name || x.title || '') + '|' + (x.resource_type || x.entity_type || x.type || '') + '|' + x.id) });
