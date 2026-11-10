// SL-20: read when the escalation fired, then delete the kept ticket, policy and business hours.
const id = '8519a0ab-cead-4c60-9395-2637f383923d', pol = '00f991cb-49ac-41d5-a02b-b4c6b8464893', bh = 'ca536ae4-494b-4400-a71d-a330224cfde2';
const j = (await api('GET', '/desk/tickets/' + id + '/activity')).j; const L = Array.isArray(j?.data) ? j.data : (j?.data?.items || []);
const fired = L.filter(e => /sla\./.test(e.action)).map(e => e.action + ' @ ' + (e.created_at || e.occurred_at || e.at || ''));
const R = { fired };
R.ticket = (await api('DELETE', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + id)).s;
R.policy = (await api('DELETE', '/desk/sla/policies/' + pol)).s;
let d = await api('DELETE', '/iam/tenant/business-hours/profiles/' + bh); if (d.s >= 400) d = await api('DELETE', '/desk/business-hours/' + bh);
R.bh = d.s + ' ' + (d.s >= 300 ? d.t.slice(0, 150) : '');
return R;
