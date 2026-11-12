const o = {}; const TK = '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5';
const dlg = page.locator('[role=dialog], [role=alertdialog]').last();
await dlg.locator('button', { hasText: /^Split$/ }).click().catch(e => o.e = String(e).slice(0, 120)); await sleep(9000);
o.url = page.url(); o.toast = (await txt()).replace(/\s+/g, ' ').match(/.{0,80}(split|new ticket).{0,80}/gi);
o.shotAfter = await shot('../wave2n/r-split-after');
const a = await api('GET', `/desk/tickets/${TK}/replies`); o.oldMsgs = arr(a.j && a.j.data).map(m => [m.id, m.direction, m.subject]);
const l = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=6&sort=-created_at'); const nw = arr(l.j && l.j.data).map(fl).find(x => /split/i.test(x.subject || '') && x.id !== TK);
if (nw) { o.newTicket = [nw.id, nw.ticket_number, nw.subject]; const t = await api('GET', `/desk/tickets/${nw.id}`); const d = t.j && t.j.data; o.newDetail = d && { dep: d.department_id, status: d.status, counts: d.counts, contact: JSON.stringify(d.contact || d.contact_id || '').slice(0, 120), parent: d.parent_ticket_id || d.split_from_ticket_id || null };
  const r = await api('GET', `/desk/tickets/${nw.id}/replies`); o.newMsgs = arr(r.j && r.j.data).map(m => [m.id, m.direction, m.subject, (m.body_text || '').slice(0, 80)]); }
const h = await api('GET', `/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/${TK}/history`); o.oldHistory = h.s + ' ' + JSON.stringify(h.j && h.j.data).slice(0, 600);
return done(o);
