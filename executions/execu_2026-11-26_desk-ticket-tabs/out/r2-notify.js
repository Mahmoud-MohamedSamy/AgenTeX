const out = {}; const SA = 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94';
const g = await api.O('GET', `/desk/resolution-confirmation/settings?department_id=${SA}`); out.base = E(g) + ' ' + short(g.j?.data, 400);
ST.RC_BASE = g.j?.data; saveState();
const body = { department_id: SA, enabled: true, waiting_status: 'On Hold', rejected_status: 'Open', rejected_team_id: null, auto_close_days: 3 };
let p = await api.O('PUT', '/desk/resolution-confirmation/settings', body); out.enable = E(p);
if (p.s >= 300) { p = await api.O('PUT', `/desk/resolution-confirmation/settings?department_id=${SA}`, body); out.enable2 = E(p); }
out.now = short((await api.O('GET', `/desk/resolution-confirmation/settings?department_id=${SA}`)).j?.data, 300);
const a = await mkTicket('O', 'QA TT R accept', { department: SA, email: QA_EMAIL });
const b = await mkTicket('O', 'QA TT R decline', { department: SA, email: QA_EMAIL });
ST.RN = { a: a.id, b: b.id }; saveState();
for (const [k, id] of [['accept', a.id], ['decline', b.id]]) {
  const r = await api.O('PUT', TK(id) + '/resolution', { content: `<p>QA TT resolution to ${k}: please click ${k === 'accept' ? 'Accept' : 'Decline'}.</p>`, notify_customer: true });
  await sleep(3000); const t = await getTicket(id); const d = (await api.O('GET', TK(id))).j?.data;
  out['R-08 ' + k] = E(r) + ' notif=' + short(r.j?.data?.notification, 300) + ' status=' + t.status + ' num=' + (d?.ticket_number || d?.ticket?.ticket_number);
}
return out;
