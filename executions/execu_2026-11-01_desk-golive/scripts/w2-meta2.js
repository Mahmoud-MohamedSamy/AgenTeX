const T='e8e5e302-3873-4e32-b945-c9cd25c7659d', C='0bbb599e-013b-4465-a41e-85a324a4e3ac';
const f = await api('GET', `/modules/${T}/fields`); const fs0 = arr(f.j && f.j.data);
const o = { first: JSON.stringify(fs0[0]).slice(0, 700) };
const k = x => x.apiName || x.api_name || x.name || x.key; o.fields = fs0.map(x => k(x) + ':' + (x.dataType || x.data_type || x.type || (x.datatype && x.datatype.key) || '') + (x.isRequired || x.is_required || x.required ? ':R' : ''));
const cf = await api('GET', `/modules/${C}/fields`); o.cfields = arr(cf.j && cf.j.data).map(x => k(x) + (x.isRequired || x.is_required || x.required ? ':R' : '')).join(',');
const r = await api('GET', `/modules/${T}/records?limit=1`); o.rec = r.s + ' ' + JSON.stringify(r.j && r.j.data).slice(0, 1800);
return done(o);
