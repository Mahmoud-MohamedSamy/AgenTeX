const o = {}; const l = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=20&sort=-created_at&q=' + encodeURIComponent('QA GL W2 split'));
o.hits = arr(l.j && l.j.data).map(fl).map(x => [x.id, x.ticket_number, x.subject, x.department_id, x.created_at, x.channel || x.source]);
for (const h of o.hits.slice(0, 2)) { const r = await api('GET', `/desk/tickets/${h[0]}/replies`); h.push(arr(r.j && r.j.data).map(m => [m.id, m.direction, m.subject, (m.body_text || '').slice(0, 200)])); }
const s = await api('GET', '/search?app=desk&q=' + encodeURIComponent('QA GL W2 split test')); o.search = s.s + ' ' + s.t.slice(0, 400);
return done(o);
