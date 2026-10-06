// Delete QA MF modules (and their records) — QA objects only.
const mods = arr((await api('GET', '/modules')).j.data).filter(m => /^QA MF/.test(m.pluralForm));
for (const m of mods) {
  const recs = await api('GET', `/modules/${m.id}/records?page_size=100`);
  for (const x of arr(recs.j && recs.j.data)) await api('DELETE', `/modules/${m.id}/records/${x.id}`);
  const d = await api('DELETE', `/modules/${m.id}?cascade=true`);
  rec('KILL.' + m.pluralForm, d.s < 300 ? 'INFO' : 'FAIL', `DELETE ${m.pluralForm} (${m.id}) → ${d.s} ${d.s >= 300 ? d.t.slice(0, 200) : ''}`);
}
return done();
