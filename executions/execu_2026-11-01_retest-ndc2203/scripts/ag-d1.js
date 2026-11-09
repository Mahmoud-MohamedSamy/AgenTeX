const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const out = {};
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.value;
const r = await api('GET', `/modules/${T}/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc`);
out.d1 = arr(r.j?.data).map(x => { const o = {}; for (const d of x.data || []) o[d.field] = val(d.value); return { id: x.id, s: o.subject, n: o.ticket_number, owner: o.owner, team: o.team, created: x.created_at }; }).filter(x => /^QA WF D1 /.test(x.s || ''));
for (const t of out.d1) { const h = await api('GET', `/desk/tickets/${t.id}/activity`); t.hist = arr(h.j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 23) + ' ' + JSON.stringify(a.summary || '').slice(0, 200)); }
out.agent = (await api('GET', '/iam/me')).j?.data?.user_id;
return out;
