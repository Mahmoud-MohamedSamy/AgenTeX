const o = {}; const TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
const EXACT = { '9804a4f1-b4d3-4b76-8638-3837001ceedc': 3106, '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5': 3159, '0b337d8e-0f37-4170-bfb9-1ea70281d6c7': 3166, 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9': 3105, '5daa40f1-bd4c-424a-930b-d4bb5759201b': 794 };
for (const id of Object.keys(EXACT)) { const g = await api('GET', `/desk/tickets/${id}`); const d = g.j && g.j.data; o['t' + EXACT[id]] = [g.s, d && d.subject, d && d.is_deleted, d && d.engine_deleted_at]; }
const b = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk'); const items = arr(b.j && b.j.data);
const pick = items.filter(x => EXACT[x.record_id] && x.module_key !== undefined); o.pick = pick.map(x => [EXACT[x.record_id], x.record_label, x.module_label, x.deleted_at]);
if (pick.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) }); o.purge = p.s + ' ' + p.t.slice(0, 300); }
for (const id of Object.keys(EXACT)) o['after' + EXACT[id]] = (await api('GET', `/desk/tickets/${id}`)).s;
const m = await api('GET', '/desk/macros'); o.macros = arr(m.j && m.j.data).filter(x => /QA GL W2/.test(JSON.stringify(x))).map(x => [x.id, x.name, x.created_at, x.created_by]);
const v = await api('GET', `/modules/${TM}/views`); o.views = arr(v.j && v.j.data && v.j.data.views).filter(x => /QA GL W2/.test(JSON.stringify(x))).map(x => [x.id, x.name, x.created_at, JSON.stringify(x).match(/.{0,60}QA GL W2.{0,60}/)[0]]);
return done(o);
