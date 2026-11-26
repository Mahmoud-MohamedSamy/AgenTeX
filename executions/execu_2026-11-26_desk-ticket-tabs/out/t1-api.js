const out = {};
const t = await mkTicket('O', 'QA TT T main', { email: QA_EMAIL }); ST.T = { t1: t.id }; saveState();
const id = t.id;
const l0 = await api.O('GET', TK(id) + '/time-entries'); out.list0 = E(l0) + ' ' + short(l0.j?.data, 300);
const p0 = await api.O('POST', TK(id) + '/time-entries', {}); out.emptyPost = E(p0);
const p1 = await api.O('POST', TK(id) + '/time-entries', { hours: 0, minutes: 30, seconds: 0, billing_type: 'billable', description: 'QA TT 30m', work_date: new Date().toISOString().slice(0, 10) });
out.add30 = E(p1) + ' ' + short(p1.j?.data, 600);
return out;
