// Reversible: every "QA AEO Layout …" that lists more than 5 profiles (made by my helper change today) → access all_users, on every module.
const out = {}; const mods = arr((await api('GET', '/modules')).j?.data);
for (const m of mods) { const lays = arr((await api('GET', `/modules/${m.id}/layouts`)).j?.data).filter(l => /^QA AEO Layout/.test(l.name) && (l.assignedProfiles || []).length > 5);
  for (const l of lays) { const g = (await api('GET', `/modules/${m.id}/layouts/${l.id}`)).j?.data; const b = { ...g, accessMode: 'all_users', assignedProfiles: [] }; delete b.id; out[m.moduleKey + ' ' + l.name + ' ' + l.id] = (await api('PUT', `/modules/${m.id}/layouts/${l.id}`, b)).s; } }
return done(out);
