const T = { m01: '89a1b22a-6eb7-4f30-ad15-8bdfc9f06d23', ar: '271150d9-49fd-4de1-a7d8-068b14d3927f', nw: '6f9037a0-15b3-4f21-a584-2e21b3b5259e' };
for (const [k, id] of Object.entries(T)) {
  const o = out[k] = {};
  const rec = flat(D((await api('GET', '/modules/' + TM + '/records/' + id)).j) || {}); o.contact = rec.contact_id; o.status = rec.status;
  const rp = await api('GET', '/desk/tickets/' + id + '/replies'); o.replies = arr(D(rp.j)).map(x => ({ mode: x.mode, st: x.status || x.delivery_status, from: x.from || x.from_address, to: x.to, subj: x.subject, body: String(x.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160) }));
  for (const p of ['/attachments', '/conversations', '/messages', '/emails', '/inbound']) { const r = await api('GET', '/desk/tickets/' + id + p); if (r.s === 200) o[p] = JSON.stringify(D(r.j)).slice(0, 900); }
}
return fin({ out });
