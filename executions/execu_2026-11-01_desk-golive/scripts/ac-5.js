const ps = D((await api('GET', '/iam/profiles?app_key=desk')).j); out.p = {};
for (const p of ps) { const e = D((await api('GET', '/iam/profiles/' + p.profileId + '/effective')).j) || []; out.p[p.name] = e.filter(k => /desk:ticket:|desk:teams|desk:department|desk:access|desk:spam/.test(k)); }
// departments of the key agents
const ids = { B: '3445ec4a', C: '9d182dfa' }; out.depAg = {};
for (const d of D((await api('GET', '/desk/departments?limit=60')).j).items || D((await api('GET', '/desk/departments?limit=60')).j)) {
  if (!/^(Marketing|Sales|Customer Support|HR|Tech)$/.test(d.name)) continue;
  const a = D((await api('GET', '/desk/departments/' + d.id + '/agents?limit=100')).j); out.depAg[d.name] = { id: d.id, ag: JSON.stringify(a).slice(0, 1200) };
}
return fin({ out });
