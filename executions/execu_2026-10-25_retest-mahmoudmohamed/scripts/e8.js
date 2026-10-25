const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await shot('2117-05-duplicate-exact');
const g = async id => { const r = await api('GET', `/modules/${L}/views/${id}`); const d = r.j.data; return { name: d.name, visibility: d.visibility, layout_id: d.layout_id, kind: d.kind, shared: d.shared_with || d.sharing || null }; };
const out = { a: await g('13996de8-93e5-4437-b546-03d1caca1194'), b: await g('1ec1626c-5c12-4552-8934-2f3c0e27e795') };
const post = async (n, vis, extra = {}) => { const r = await api('POST', `/modules/${L}/views`, { name: n, kind: 'list', visibility: vis, ...extra, settings: { criteria: { conditions: [{ field: 'lead_source', operator: 'equals', value: 'web' }] } } }); return r.s + ' ' + (r.j?.data?.id ? 'CREATED ' + r.j.data.id : (r.j?.error?.code || r.t.slice(0, 120))); };
out.newCase = await post('qa RT 2098 Last', 'private');
return done(out);
