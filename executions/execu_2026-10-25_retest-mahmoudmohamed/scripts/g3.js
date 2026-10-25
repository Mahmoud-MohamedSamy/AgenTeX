const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', F = 'daf30263-27bf-484d-8ddf-0ba2133b8f4e', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1', V = '58e91b86-e52b-4964-801a-f482c6676c6e';
const cur = async () => arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.id === F);
const put = async vals => { const c = await cur(); const body = { fieldName: c.fieldName, labels: c.labels, datatypeKey: c.datatypeKey, datatypeOptions: { ...c.datatypeOptions, allowed_values: vals }, required: false, unique: false, uniquePeerModuleIds: [], rowVersion: c.rowVersion }; const r = await api('PUT', `/modules/${L}/fields/${F}`, body); return r.s + ' ' + (r.s >= 300 ? (r.j?.error?.message || r.t).slice(0, 200) : ''); };
const out = {};




const v = (await api('GET', `/modules/${L}/views/${V}`)).j.data;
const up = await api('PATCH', `/modules/${L}/views/${V}`, { name: v.name, kind: v.kind, visibility: v.visibility, layout_id: v.layout_id, settings: { ...v.settings, criteria: { conditions: [{ field: 'qa_rt_pick', operator: 'equals', value: 'QA RT opt A' }] } } }); out.viewChanged = up.s;
out.removeBafter = await put(['QA RT opt A']); out.optsEnd = (await cur()).datatypeOptions.allowed_values;
return done(out);
