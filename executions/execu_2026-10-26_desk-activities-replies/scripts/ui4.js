// Read-only (agent fedelav803): list tickets visible, open newest ticket with an email thread, read conversation + composer
const calls = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/') && !/heartbeat|presence|\/iam\/|notifications/.test(u)) calls.push(r.method() + ' ' + u.replace(API, '').slice(0, 200)); }; page.on('request', f);
const out = {};
const L = await api('GET', `/modules/${M.tickets}/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc`);
const recs = (L.j && L.j.data && (L.j.data.records || L.j.data.items || L.j.data)) || [];
out.total = L.j && L.j.meta && L.j.meta.total_count;
const fl = r => { const o = { id: r.id }; for (const x of (r.data || [])) o[x.field] = x.value && (x.value.value !== undefined ? x.value.value : x.value); return o; };
out.list = (Array.isArray(recs) ? recs : []).slice(0, 50).map(fl).map(o => ({ id: o.id, num: o.ticket_number || o.number, subj: String(o.subject || '').slice(0, 50), ch: o.channel, st: o.status, email: o.email }));
const pick = out.list.find(t => /email/i.test(JSON.stringify(t.ch || ''))) || out.list[0];
out.pick = pick;
if (pick) {
  out.replies = (await api('GET', `/desk/tickets/${pick.id}/replies`)).t.slice(0, 2500);
  out.comments = (await api('GET', `/desk/tickets/${pick.id}/comments`)).t.slice(0, 800);
  out.drafts = (await api('GET', `/desk/tickets/${pick.id}/drafts`)).t.slice(0, 600);
  out.activity = (await api('GET', `/desk/tickets/${pick.id}/activity`)).t.slice(0, 800);
  calls.length = 0; await go(`/modules/${M.tickets}/records/${pick.id}`, 14000);
  out.ticketText = (await txt()).slice(0, 3500); out.ticketShot = await shot('tavi-ticket-conversation');
  out.ticketButtons = await page.$$eval('main button, main [role=tab]', bs => [...new Set(bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean))]);
  out.calls = [...new Set(calls)];
}
page.off('request', f);
return done(out);
