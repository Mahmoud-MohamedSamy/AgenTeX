for (const [k, id] of [['t3278', '89a1b22a-6eb7-4f30-ad15-8bdfc9f06d23'], ['t3280', '6f9037a0-15b3-4f21-a584-2e21b3b5259e']]) {
  const rp = await api('GET', '/desk/tickets/' + id + '/replies');
  out[k] = arr(D(rp.j)).map(x => ({ dir: x.direction, mode: x.mode, st: x.status, from: x.from || x.from_address, to: (x.to || []).join(';'), subj: x.subject, at: x.created_at, body: String(x.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 140) }));
  out[k + 'status'] = flat(D((await api('GET', '/modules/' + TM + '/records/' + id)).j) || {}).status;
}
const r = await api('GET', '/modules/' + TM + '/records?limit=30&sort=-created_at');
out.newTickets = arr(D(r.j)).map(flat).filter(t => t.created_at > '2026-11-12T20:50' && /mmohamed@anyware/.test(t.email || '')).map(t => [t.ticket_number, t.subject]);
return fin({ out });
