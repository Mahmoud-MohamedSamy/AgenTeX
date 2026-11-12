const s = JSON.parse(fs.readFileSync('../a4/i29.json'));
const g = await getTicket(s.ticket); log('fields', JSON.stringify(Object.fromEntries(Object.entries(g).filter(([k]) => /rat|happ|feedback/i.test(k)))));
for (const p of [`/desk/tickets/${s.ticket}/ratings`, `/desk/tickets/${s.ticket}/feed`, `/desk/tickets/${s.ticket}/activity`, `/desk/tickets/${s.ticket}/history`, `/desk/hq/ratings?ticketId=${s.ticket}`]) { const r = await api('GET', p); log(p.split('/').slice(-1)[0], r.s, r.t.replace(/[\w.+-]+@[\w.-]+/g, '<e>').match(/.{0,80}(rating|happiness).{0,120}/i)?.[0] || r.t.slice(0, 120)); }
