const a = await api('GET', '/desk/channels/addresses'); const L = arr(a.j && a.j.data); const cs = L.find(x => x.department_id === '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'); if (!cs) return 'no address ' + a.s;
const to = cs.address; const o = { addrLen: to.length };
const sa = await api('GET', '/emails/sendability'); o.sendability = sa.s + ' ' + JSON.stringify(sa.j && sa.j.data).slice(0, 200);
const lead = I.recs[I.recs.length - 1][1]; const mid = await modId();
for (const body of [{ module_id: mid, record_id: lead, to: [to], cc: [], subject: 'QA VR1112 BADMAIL G17', body_html: '<p>QA validation rule email-to-ticket test</p>' }, { module_id: mid, record_id: lead, to: [{ email: to }], cc: [], subject: 'QA VR1112 BADMAIL G17', body_html: '<p>QA validation rule email-to-ticket test</p>' }]) {
  const r = await api('POST', '/emails', body); o['send' + (o.n = (o.n || 0) + 1)] = SR(r).slice(0, 300).split(to).join('<support>'); if (r.s < 300) break; }
LED('G17 email sent to support address (len ' + to.length + ')'); return o;
