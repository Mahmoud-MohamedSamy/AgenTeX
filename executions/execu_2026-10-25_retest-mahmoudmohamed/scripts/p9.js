const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
const cnt = async id => (await api('GET', `/modules/${L}/records?page=1&per_page=1&layout_id=${LAY}&view_id=${id}`)).j?.meta?.total_count;
const mk = async (n, p) => { const r = await api('POST', `/modules/${L}/views`, { name: n, kind: 'list', visibility: 'private', layout_id: LAY, settings: { criteria: { conditions: [{ field: 'first_name', operator: 'contains', value: 'QA' }, { field: 'lead_source', operator: 'is_not_empty' }], pattern: p } } }); return r.j?.data?.id || ('ERR ' + r.t.slice(0, 200)); };
const out = { uiAnd: await cnt('6f41abfa-3d8b-42fb-ab86-6fbf30f5bbf0'), apiAndMixed: await cnt('c60d7685-61a8-4f94-98cc-75ccbe0cdef0') };
const ids = { lowOr: await mk('QA RT 2122 low or', '1 or 2'), upOr: await mk('QA RT 2122 UP OR', '1 OR 2'), lowAnd: await mk('QA RT 2122 low and', '1 and 2'), upAnd: await mk('QA RT 2122 UP AND', '1 AND 2') };
out.ids = ids; for (const [k, id] of Object.entries(ids)) if (!/^ERR/.test(id)) out[k] = await cnt(id);
return done(out);
