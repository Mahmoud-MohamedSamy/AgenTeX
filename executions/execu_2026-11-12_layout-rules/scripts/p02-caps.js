// which datatypes can be a layout-rule primary field / target (from field.capabilities)
const app = process.env.APP || 'crm';
const mods = arr((await api('GET', '/modules')).j?.data);
const m = mods.find(x => x.moduleKey === (app === 'crm' ? 'leads' : 'desk_tickets'));
const F = arr((await api('GET', '/modules/' + m.id + '/fields')).j?.data);
const by = {};
for (const f of F) { const k = f.datatypeKey; const c = f.capabilities || {}; by[k] = by[k] || { n: 0, caps: {} }; by[k].n++; for (const [ck, cv] of Object.entries(c)) if (/rule|layout|require|read|value|filter/i.test(ck)) { by[k].caps[ck] = by[k].caps[ck] || {}; by[k].caps[ck][String(cv)] = (by[k].caps[ck][String(cv)] || 0) + 1; } }
const capKeys = Object.keys(F[0]?.capabilities || {});
return { capKeys, by };
