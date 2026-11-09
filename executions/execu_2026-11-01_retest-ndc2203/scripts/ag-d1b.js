const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const out = {};
const enc = v => ({ kind: 'string', value: String(v) });
const me = (await api('GET', '/iam/me')).j?.data?.user_id;
const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA WF D1 agent owner ticket', status: 'Open', department: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', email: 'mmohamed@anyware.software', channel: 'email', owner: me }).map(([k, v]) => ({ field: k, value: enc(v) })) });
out.create = r.s; out.id = r.j?.data?.id; await sleep(5000);
if (out.id) { const g = await api('GET', `/modules/${T}/records/${out.id}`); const o = {}; for (const x of g.j?.data?.data || []) o[x.field] = x.value?.value ?? x.value; out.after = { n: o.ticket_number, owner: o.owner, team: o.team };
  out.hist = arr((await api('GET', `/desk/tickets/${out.id}/activity`)).j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 23) + ' ' + JSON.stringify(a.summary || '').slice(0, 220)); }
return out;
