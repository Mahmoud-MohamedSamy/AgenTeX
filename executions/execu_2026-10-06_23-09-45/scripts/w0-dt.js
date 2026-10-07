const d = await api('GET', '/fields/datatypes');
const L = arr(d.j && d.j.data);
const ex = [];
for (const m of Object.values(M)) { for (const f of arr((await api('GET', `/modules/${m}/fields`)).j.data)) { const c = f.config || {}; const k = Object.keys(c).filter(x => !['required', 'unique', 'uniquePeerModuleIds'].includes(x)); if (k.length || Object.keys(f.datatypeOptions || {}).length) ex.push({ f: f.fieldName, t: f.datatypeKey, cfg: k.reduce((a, x) => (a[x] = c[x], a), {}), opt: f.datatypeOptions }); } }
rec('DT', 'INFO', 'datatypes', { types: L.map(t => ({ key: t.key, schema: t.optionsSchema || t.options_schema || t.datatypeOptionsSchema || t.options || t.schema || Object.keys(t) })), examples: ex.slice(0, 60) });
return done();
