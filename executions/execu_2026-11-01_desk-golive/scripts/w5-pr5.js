const base = [{ field: 'product_name', value: { kind: 'string', value: 'QA GL W5 Product API' } }];
const tries = { noDept: base, deptStrArr: [...base, { field: 'departments', value: { kind: 'array', items: [{ kind: 'string', value: MK }] } }] };
for (const [k, data] of Object.entries(tries)) { const r = await api('POST', '/modules/' + PM + '/records', { data }); out[k] = r.s + ' ' + r.t.slice(0, 260); const id = r.j && r.j.data && r.j.data.id; if (id) CREATED.push({ kind: 'product', id, name: 'QA GL W5 Product API ' + k, mod: PM }); }
const ex = await api('GET', '/modules/' + PM + '/records?page=1&per_page=2&sort=-created_at'); out.sample = JSON.stringify(arr(D(ex.j)).map(x => x.data.filter(d => /depart/.test(d.field)))).slice(0, 400);
return fin({ out });
