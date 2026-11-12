const o = {}; const l = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=25&sort=-created_at');
o.newest = arr(l.j && l.j.data).map(fl).map(x => [x.id, x.ticket_number, (x.subject || '').slice(0, 40), x.created_at, x.channel || x.source, x.contact_email || x.email]);
const n = await api('GET', '/notifications?limit=10'); o.notes = n.s + ' ' + n.t.slice(0, 600);
return done(o);
