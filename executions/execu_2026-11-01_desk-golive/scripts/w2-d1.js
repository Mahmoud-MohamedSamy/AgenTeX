const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {}; const DAR = 'f6cf3a84-fc16-4e33-a671-3fcb26bc1422';
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 240) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 220) : undefined });
const at = new Date(Date.now() + 86400e3).toISOString();
const sr = await api('POST', `${P}/scheduled-replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>', send_at: at, scheduled_at: at }, { 'Idempotency-Key': 'qa-gl-w2-sched-' + Date.now() }); o.sched = sh(sr);
const sl = await api('GET', '/desk/scheduled-replies'); const items = (sl.j && sl.j.data && sl.j.data.scheduled_replies) || []; o.schedList = items.map(x => [x.id, x.status, x.send_at || x.scheduled_at, x.ticket_id === tk]);
const mine = items.find(x => x.ticket_id === tk); if (mine) { o.schedCancel = sh(await api('DELETE', `/desk/scheduled-replies/${mine.id}`)); if (o.schedCancel.s >= 400) o.schedCancel2 = sh(await api('POST', `/desk/scheduled-replies/${mine.id}/cancel`, {})); const sl2 = await api('GET', '/desk/scheduled-replies'); o.schedAfter = ((sl2.j && sl2.j.data && sl2.j.data.scheduled_replies) || []).filter(x => x.ticket_id === tk).map(x => [x.id, x.status]); }
// snippets
const sn = await api('POST', '/desk/snippets', { name: 'QA GL W2 snippet', title: 'QA GL W2 snippet', body_html: '<p>Hello {{customer_name}}, ticket #{{ticket_number}}</p>', content_html: '<p>Hello {{customer_name}}, ticket #{{ticket_number}}</p>', scope: 'personal' }); o.snippet = sh(sn); const sid = sn.j && sn.j.data && (sn.j.data.id || (sn.j.data.snippet && sn.j.data.snippet.id));
if (sid) { CREATED.push({ k: 'snippet', id: sid }); o.resolve = sh(await api('POST', `${P}/snippets/resolve`, { snippet_id: sid, body_html: '<p>Hello {{customer_name}}, ticket #{{ticket_number}}</p>' })); }
o.emailTpl = sh(await api('GET', `${P}/email-templates`)); if (o.emailTpl.s === 404) o.emailTpl2 = sh(await api('GET', '/desk/email-templates'));
// assign / pick-up / unassign
const qa = await api('GET', '/desk/queues/agents'); const agents = (qa.j && qa.j.data && qa.j.data.agents) || []; o.agents = agents.map(a => [a.user_id, a.status || '', a.name]);
const other = agents.find(a => a.user_id !== ME); if (other) { o.assign = sh(await api('POST', `${P}/assign`, { owner_id: other.user_id })); const g = await getRec(T, tk); o.ownerAfter = g.o && g.o.owner; }
o.unassign = sh(await api('POST', `${P}/assign`, { owner_id: null }));
o.pickUp = sh(await api('POST', `${P}/pick-up`, {})); const g2 = await getRec(T, tk); o.ownerAfterPick = g2.o && g2.o.owner;
// status flow
o.onHold = sh(await patchRec(T, tk, { status: 'On Hold' }));
o.close = sh(await api('POST', `${P}/close`, {})); const g3 = await getRec(T, tk); o.statusAfterClose = g3.o && g3.o.status;
o.reopen = sh(await api('POST', `${P}/reopen`, {})); const g4 = await getRec(T, tk); o.statusAfterReopen = g4.o && g4.o.status;
o.badStatus = sh(await patchRec(T, tk, { status: 'Bogus' }));
o.edit = sh(await patchRec(T, tk, { subject: 'QA GL W2 base ticket edited', priority: 'Urgent', due_date: new Date(Date.now() + 2 * 86400e3).toISOString() }));
// move + back, share
o.move = sh(await api('POST', `${P}/move`, { department_id: DAR })); const g5 = await getRec(T, tk); o.deptAfterMove = g5.o && g5.o.department;
o.moveBack = sh(await api('POST', `${P}/move`, { department_id: DQ })); const g6 = await getRec(T, tk); o.deptAfterBack = g6.o && g6.o.department;
o.share = sh(await api('PUT', `${P}/shares`, { shares: [{ department_id: DAR, access: 'read_only' }] }));
o.shareList = sh(await api('GET', `${P}/shares`));
o.shareFull = sh(await api('PUT', `${P}/shares`, { shares: [{ department_id: DAR, access: 'full' }] }));
o.unshare = sh(await api('PUT', `${P}/shares`, { shares: [] }));
return fin(o);
