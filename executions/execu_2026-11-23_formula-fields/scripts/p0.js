const ts = await api('GET', '/teamspaces'); log('teamspaces', E(ts), L(ts.j?.data).map(t => [t.id, t.name || t.labels?.en]));
const dt = await api('GET', '/fields/datatypes'); const all = L(dt.j?.data); log('datatypes', E(dt), all.length);
const f = all.find(x => x.key === 'formula'); log('formula', f && { opts: f.options_schema, caps: f.capabilities, def: f.default_config });
log('keys', all.map(x => x.key).join(' '));
const mods = await api('GET', '/modules'); log('modules', E(mods), L(mods.j?.data).filter(m => /qa/i.test(m.moduleKey || '')).map(m => [m.id, m.moduleKey]));
const fn = await api('GET', '/reporting/formulas/functions'); log('report fns', E(fn), JSON.stringify(fn.j).slice(0, 300));
