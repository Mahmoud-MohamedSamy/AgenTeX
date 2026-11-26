const out = {};
const b = await api.O('PUT', TK(ST.RN.b) + '/resolution', { content: '<p>QA TT resolution to decline: please click Decline.</p>', notify_contact: true });
out['R-08 decline send'] = E(b) + ' notif=' + short(b.j?.data?.notification, 300);
await sleep(4000);
for (const k of ['a', 'b']) { const d = (await api.O('GET', TK(ST.RN[k]))).j?.data; const t = d?.ticket || d; out[k] = 'status=' + (await getTicket(ST.RN[k])).status + ' res=' + short(t?.resolution, 300); }
// R-09 proper: notify on a ticket without contact email (CS ticket t2)
const r9 = await api.O('PUT', TK(ST.R.t2) + '/resolution', { content: '<p>QA TT notify no email v2</p>', notify_contact: true }); out['R-09'] = E(r9) + ' notif=' + short(r9.j?.data?.notification, 200);
// R-09b: CS department has confirmation OFF; notify on CS ticket WITH email
const r9b = await api.O('PUT', TK(ST.R.t1) + '/resolution', { content: '<p>QA TT notify CS (confirmation off)</p>', notify_contact: true }); out['R-09b CS off + email'] = E(r9b) + ' notif=' + short(r9b.j?.data?.notification, 300);
return out;
