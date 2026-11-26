const out = {}; const SA = 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94';
const h = await api.O('GET', TK(ST.RN.b) + '/history'); const it = arr(h.j?.data?.items || h.j?.data?.events || h.j?.data);
out.histKeys = Object.keys(it[0] || {}); out.histSample = it.slice(0, 6).map(x => short(x, 220));
const c = await mkTicket('O', 'QA TT R edit-then-notify', { department: SA }); ST.RN.c = c.id; saveState();
out.save1 = E(await api.O('PUT', TK(c.id) + '/resolution', { content: '<p>QA TT first, no notify</p>', notify_contact: false }));
out.status1 = (await getTicket(c.id)).status;
// no email on c -> add contact email? c has no email: expect 422. so use a 4th ticket with email
const d = await mkTicket('O', 'QA TT R edit-then-notify2', { department: SA, email: QA_EMAIL }); ST.RN.d = d.id; saveState();
out.d1 = E(await api.O('PUT', TK(d.id) + '/resolution', { content: '<p>QA TT first, no notify</p>', notify_contact: false })); out.dStatus1 = (await getTicket(d.id)).status;
const d2 = await api.O('PUT', TK(d.id) + '/resolution', { content: '<p>QA TT edited, now notify (you can ignore this email)</p>', notify_contact: true }); await sleep(3000);
out.d2 = E(d2) + ' notif=' + short(d2.j?.data?.notification, 200); out.dStatus2 = (await getTicket(d.id)).status;
return out;
