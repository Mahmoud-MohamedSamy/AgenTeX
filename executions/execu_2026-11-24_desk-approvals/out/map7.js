const o = {};
for (const id of ['44444444-4444-4444-4444-444444444401','44444444-4444-4444-4444-444444444402','44444444-4444-4444-4444-444444444404']) {
  for (const p of [`/iam/profiles/${id}/permissions`, `/iam/profiles/${id}`]) { const r = await api('GET', p); o[p] = r.s + ' ' + (r.t.match(/[^"]*approv[^"]*/gi) || []).join(',').slice(0, 600); }
}
return o;
