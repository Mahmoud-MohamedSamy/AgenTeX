const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const r = await api('GET', `/modules/${L}/fields`); const a = arr(r.j?.data);
const pick = a.filter(f => /^(lookup_3_9|multi_select_lookup_8_9|lookup|converted_contact)$/.test(f.apiName)).map(f => ({ api: f.apiName, layouts: f.layouts, opts: JSON.stringify(f.datatypeOptions || f.config || {}).slice(0, 200) }));
const l = await api('GET', `/modules/${L}/layouts`); const lay = arr(l.j?.data).map(x => x.id + ' ' + x.name);
return done({ pick, lay });
