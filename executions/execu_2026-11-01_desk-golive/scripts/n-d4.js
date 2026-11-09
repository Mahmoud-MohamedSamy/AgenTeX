const o = {}; const names = { '876ce871': 'pacox(Sup)', '23f0f9d7': 'm2(Sup)', '9d182dfa': 'fed(Agent)', '2a7c1bc4': 'kin(Adm)', 'e82f62cb': 'pob(Adm)', '5491656d': 'bel(Adm)', '18ba78c4': 'm1(Adm)', 'd23fb4e0': 'samy(Adm)', '3445ec4a': '1515(Adm)' };
const deps = (await api('GET', '/desk/departments')).j.data; const by = {};
for (const d of deps) { const r = (await api('GET', '/desk/departments/' + d.id)).j.data; for (const u of r.agent_user_ids || []) { const n = names[u.slice(0, 8)]; if (n) (by[n] = by[n] || []).push(d.name); } }
o.by = by; return done(o);
