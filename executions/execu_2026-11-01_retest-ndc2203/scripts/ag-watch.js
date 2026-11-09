// Watch ticket #577 (read-only): inbound reply, then the A1 rule's comment.
const id = '70c80b92-d7ac-4c15-b0f6-4e76d8a9139c'; let inbound = null, fired = null;
for (let i = 0; i < 27 && !fired; i++) {
  const rp = (await api('GET', `/desk/tickets/${id}/replies`)).j?.data; const list = arr(rp?.replies || rp);
  const inb = list.find(r => r.direction !== 'outbound'); if (inb && !inbound) inbound = { dir: inb.direction, at: inb.created_at, subj: inb.subject };
  if (inbound) { const c = arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).find(c => /A1 fired/.test(c.body_html)); if (c) fired = { body: c.body_html, at: c.created_at }; }
  if (!fired) await sleep(20000);
}
const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).slice(0, 8).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').slice(0, 160));
return { inbound, fired, history: h };
