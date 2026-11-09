const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.value;
const r = await api('GET', `/modules/${T}/records?page=1&per_page=60&sort_by=created_at&sort_dir=desc`);
const L = arr(r.j?.data).map(x => { const o = {}; for (const d of x.data || []) o[d.field] = val(d.value); return { id: x.id, s: o.subject, n: o.ticket_number, owner: o.owner ?? null, team: o.team ?? null }; }).filter(x => /^QA WF Y/.test(x.s || ''));
for (const t of L) t.hist = arr((await api('GET', `/desk/tickets/${t.id}/activity`)).j?.data).filter(a => /owner|assign|workflow|team|created/.test(a.action)).map(a => a.action + ' ' + a.occurred_at.slice(11, 23) + ' ' + JSON.stringify(a.summary || '').slice(0, 110));
return L;
