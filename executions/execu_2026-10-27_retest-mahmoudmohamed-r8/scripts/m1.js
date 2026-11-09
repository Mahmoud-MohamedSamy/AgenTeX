const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const fl = arr((await api('GET', `/modules/${D}/fields`)).j?.data); out.dealPipelineFields = fl.filter(f => /pipeline/i.test(f.apiName || f.fieldName)).map(f => ({ id: f.id, api: f.apiName, dt: f.datatypeKey, custom: f.isCustomField, sys: f.isSystemField, opts: JSON.stringify(f.datatypeOptions || {}).slice(0, 200) }));
const lays = arr((await api('GET', `/modules/${L}/layouts`)).j?.data); const l0 = lays.find(x => x.isDefault) || lays[0];
out.layoutKeys = Object.keys(l0); out.layoutAccess = Object.fromEntries(Object.entries(l0).filter(([k]) => /access|profile|assign|status|default/i.test(k)).map(([k, v]) => [k, JSON.stringify(v).slice(0, 150)]));
out.layouts = lays.map(x => x.name + ' ' + x.id.slice(0, 8) + ' ' + (x.accessMode || '') );
const p = await api('GET', '/notifications/preferences/me'); out.prefs = p.s + ' ' + p.t.slice(0, 1500);
return done(out);
