const id = 'e5fac28a-0f38-4e1d-a705-49659a8647bb'; if (!made.bps.includes(id)) { made.bps.push(id); keep(); }
const b = await getBp(id); log('keys', Object.keys(b||{}).join(','));
const dr = await api('GET', `/modules/${TK}/blueprints/${id}/draft`); log('draft', dr.s);
const def = dr.j?.data?.definition || b.definition; log(JSON.stringify({ crit: def.entryCriteria, strict: def.strictMode ?? def.strict, keys: Object.keys(def), tr: def.transitions }).slice(0, 3500));
