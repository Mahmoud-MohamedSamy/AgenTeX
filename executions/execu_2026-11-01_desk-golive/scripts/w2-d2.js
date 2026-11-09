const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {}; const OTHER = '87d8c554-7af9-4379-bb16-40741e109c00';
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 240) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 200) : undefined });
const at = new Date(Date.now() + 86400e3).toISOString(); const key = 'qa-gl-w2-sched-' + Date.now();
const sr = await api('POST', `${P}/scheduled-replies`, { idempotency_key: key, mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>', send_at: at, scheduled_at: at }, { 'Idempotency-Key': key }); o.sched = sh(sr);
const sl = await api('GET', '/desk/scheduled-replies'); const items = (sl.j && sl.j.data && sl.j.data.scheduled_replies) || []; o.schedList = items.map(x => [x.id, x.status, x.send_at || x.scheduled_at, x.ticket_id === tk]);
const sn = await api('POST', '/desk/snippets', { name: 'qa_gl_w2', title: 'QA GL W2 snippet', body_html: '<p>Hello {{customer_name}}, ticket #{{ticket_number}}</p>', scope: 'personal' }); o.snippet = sh(sn); const sid = sn.j && sn.j.data && (sn.j.data.id || (sn.j.data.snippet && sn.j.data.snippet.id));
if (sid) { CREATED.push({ k: 'snippet', id: sid }); o.resolve = sh(await api('POST', `${P}/snippets/resolve`, { snippet_id: sid, body_html: '<p>Hello {{customer_name}}, ticket #{{ticket_number}}</p>', text: '#qa_gl_w2' })); }
// QA department with two agents for assignment cases
const dp = await api('POST', '/desk/departments', { name: 'QA GL W2 Dept', description: 'Go-live wave 2 assign test, delete after', visibility: 'private' }); o.dept = sh(dp); const did = dp.j && dp.j.data && dp.j.data.id;
if (did) { CREATED.push({ k: 'department', id: did }); o.deptAgents = sh(await api('PUT', `/desk/departments/${did}/agents`, { agent_user_ids: [ME, OTHER], user_ids: [ME, OTHER] }));
  const t2 = await mkRec(T, { subject: 'QA GL W2 assign ticket', status: 'Open', priority: 'Low', department: did, contact_id: '4abedf97-3ea0-4abb-a3d4-493e728cd05c' }, 'assign'); o.t2 = [t2.s, t2.id, t2.e && t2.e.message];
  if (t2.id) { const Q = `/desk/tickets/${t2.id}`; o.assignOther = sh(await api('POST', `${Q}/assign`, { owner_id: OTHER })); o.ownerNow = (await getRec(T, t2.id)).o.owner;
    o.unassign = sh(await api('POST', `${Q}/assign`, { owner_id: null })); o.pickUp = sh(await api('POST', `${Q}/pick-up`, {})); o.ownerAfterPick = (await getRec(T, t2.id)).o.owner;
    o.unassignOwnerOnly = sh(await api('PATCH', `/modules/${T}/records/${t2.id}`, body({ owner: null }))); } }
// put base ticket owner back to me
o.baseOwner = sh(await patchRec(T, tk, { owner: ME }));
return fin(o);
