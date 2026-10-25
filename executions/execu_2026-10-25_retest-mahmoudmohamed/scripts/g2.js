const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', F = 'daf30263-27bf-484d-8ddf-0ba2133b8f4e';
const cur = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.id === F);
const put = async vals => { const body = { fieldName: cur.fieldName, labels: cur.labels, datatypeKey: cur.datatypeKey, datatypeOptions: { ...cur.datatypeOptions, allowed_values: vals }, required: false, unique: false, uniquePeerModuleIds: [], rowVersion: cur.rowVersion }; let r = await api('PUT', `/modules/${L}/fields/${F}`, body); if (r.s === 404 || r.s === 405) r = await api('PATCH', `/modules/${L}/fields/${F}`, body); return r.s + ' ' + r.t.slice(0, 300); };
const out = {};
out.removeB = await put(['QA RT opt A', 'QA RT opt C']);
out.optsAfterB = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.id === F)?.datatypeOptions?.allowed_values;
return done(out);
