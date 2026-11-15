const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const hs = D((await api('GET', '/desk/happiness/settings')).j); out.base = hs;
const mask = e => String(e || '').replace(/^(.{3})[^@]*/, '$1…');
for (const q of ['mmohamed', 'mahmoud.mmohamedsamy']) {
  const r = arr(D((await api('GET', '/modules/' + CM + '/records?limit=10&q=' + q)).j)).map(flat);
  out[q] = [];
  for (const c of r) { const t = arr(D((await api('GET', '/modules/' + TM + '/records?limit=50&q=' + encodeURIComponent(c.email || '') )).j)).map(flat);
    out[q].push({ id: c.id, email: mask(c.email), name: c.full_name || c.last_name, tickets: t.filter(x => x.contact_id === c.id).map(x => ({ n: x.ticket_number || x.number, st: x.status, dep: x.department_id, s: String(x.subject || '').slice(0, 50) })) }); }
}
for (const p of ['/desk/happiness/ratings?limit=5', '/desk/happiness/responses?limit=5', '/desk/happiness/report', '/desk/happiness/dashboard']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 200); }
return fin({ out });
