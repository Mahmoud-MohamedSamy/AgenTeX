const o = { polls: [] };
for (let i = 0; i < 10; i++) { const l = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=8&sort=-created_at'); const rows = arr(l.j && l.j.data).map(fl); const hit = rows.find(x => /split/i.test(x.subject || '')); o.polls.push([new Date().toISOString().slice(11, 19), rows[0] && rows[0].ticket_number]); if (hit) { o.hit = [hit.id, hit.ticket_number, hit.subject, hit.department_id, hit.channel]; break; } await sleep(28000); }
return done(o);
