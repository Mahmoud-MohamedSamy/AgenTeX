const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.value;
const r = await api('GET', `/modules/${T}/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc`);
return arr(r.j?.data).map(x => { const o = {}; for (const d of x.data || []) o[d.field] = val(d.value); return { id: x.id, s: o.subject, n: o.ticket_number, owner: o.owner ?? null, team: o.team, at: x.created_at }; }).filter(x => /^QA WF V1 form/.test(x.s || ''));
