const s = JSON.parse(fs.readFileSync('../a4/i29.json'));
const g = await getTicket(s.ticket); log({ num: g.ticket_number, status: g.status, emailLen: String(g.email||'').length, emailTag: String(g.email||'').includes('+qaao'), contact: !!g.contact_id });
log('execs', JSON.stringify(await execs(s.ticket)));
const rp = await api('GET', `/desk/tickets/${s.ticket}/replies`); const L = arr(rp.j?.data || rp.j);
log('replies', rp.s, L.length, JSON.stringify(L.map(r => ({ dir: r.direction, kind: r.kind || r.type, st: r.status || r.delivery_status, subj: r.subject, err: r.last_error || r.error, at: r.created_at })).slice(0, 10)));
for (const p of ['/desk/happiness', `/desk/happiness?ticketId=${s.ticket}`, `/desk/tickets/${s.ticket}/happiness`]) { const r = await api('GET', p); log(p, r.s, r.t.slice(0, 400)); }
