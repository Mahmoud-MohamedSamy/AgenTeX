const R = {};
R.F1t = { rule: await mkRule('F1t2', { kind: 'RecordCreated' }, [{ type: 'Email', standaloneActionId: 'e0f8587b-b955-4671-bb08-ca19ae017f28' }]) };
R.F1t.ticket = await mkTicket('F1t2');
// D1 ticket from batch 1: newest tickets with subject "QA WF D1 "
const r = await api('GET', `/modules/${T}/records?page=1&per_page=40&sort_by=created_at&sort_dir=desc`);
R.recent = arr(r.j?.data).map(x => { const o = {}; for (const d of x.data || []) o[d.field] = val(d.value); return { id: x.id, s: o.subject, owner: o.owner, team: o.team }; }).filter(x => /^QA WF D1 /.test(x.s || ''));
const h = await api('GET', '/desk/tickets/02cda707-f03c-4e20-a61f-6024fb40c4d4/activity'); R.histSample = h.s + ' ' + h.t.slice(0, 1500);
return fin(R);
