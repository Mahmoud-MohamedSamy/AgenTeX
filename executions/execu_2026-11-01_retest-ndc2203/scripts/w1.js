const out = {};
for (const [k, id] of [['A4', '44681cc8-30c5-49b5-a50d-718fee90c862'], ['A1', '03788922-37ae-41c9-a9ea-2d3f5f565738']]) {
  const rp = (await api('GET', `/desk/tickets/${id}/replies`)).j?.data; const t = await getTicket(id);
  out[k] = { status: t.status, custResp: t.customer_responded, replies: arr(rp?.replies || rp).map(r => (r.direction || r.kind || r.type) + ' ' + (r.visibility || r.thread_kind || '') + ' ' + r.created_at?.slice(11, 19) + ' ' + (r.from_email || r.from || '').toString().replace(/@.*/, '@…') + ' ' + (r.subject || '').slice(0, 40)),
    fired: arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html.replace(/<[^>]+>/g, '') + ' @' + c.created_at.slice(11, 19)) };
}
return done(out);
