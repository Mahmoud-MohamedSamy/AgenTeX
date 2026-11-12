const out = {};
const s = await api('GET', '/search?q=' + encodeURIComponent('QA GL W2') + '&app=desk'); out.search = s.s + ' ' + s.t.slice(0, 400);
const rb0 = await api('GET', `/modules/${T}/records/${IDS.base}`); out.recBase = rb0.s + ' ' + rb0.t.slice(0, 200);
{ const r = await api('GET', '/audit/recycle-bin/items?q=' + encodeURIComponent('QA GL W2') + '&limit=50'); out.rb = r.s + ' ' + JSON.stringify(arr(r.j && r.j.data).filter(x => /QA GL W2/.test(JSON.stringify(x))).map(x => [x.title || x.name || x.display_name, x.deleted_at, x.deleted_by_name || x.deleted_by])).slice(0, 900); }
for (const [k, p] of [['macro', '/desk/macros/f723e149-1ef7-4987-af11-6edee2b61580'], ['template', '/desk/ticket-templates/84afac47-75e9-4386-91f7-37134b9f59e6'], ['snippet', '/desk/snippets/4e152318-390d-4d91-b943-99fb33328f64'], ['tag', '/desk/tags/e1267f7d-9cee-4f6d-b905-3b70c41073ba'], ['view', '/views/7bc907e3-7066-4e33-b1b6-3637c9dd193f']]) { const r = await api('GET', p); out[k] = r.s; }
const al = await api('GET', `/audit/logs?entity_id=${IDS.base}`); out.audit = al.s + ' ' + al.t.slice(0, 300);
return fin(out);
