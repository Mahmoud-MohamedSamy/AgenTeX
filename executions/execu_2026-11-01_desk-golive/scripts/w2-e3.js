const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {}; const C1 = 'f3bf9581-ca76-46a9-a56e-0d757de60b27';
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 240) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 240) : undefined });
// email-channel ticket for scheduled reply
const em = await mkRec(T, { subject: 'QA GL W2 email channel', status: 'Open', department: DQ, channel: 'Email', contact_id: '4abedf97-3ea0-4abb-a3d4-493e728cd05c', email: 'mmohamed@anyware.software' }, 'email'); o.emailTicket = [em.s, em.id, em.e && em.e.message];
if (em.id) { const at = new Date(Date.now() + 86400e3).toISOString(); const key = 'qa-gl-w2-sched-' + Date.now();
  o.sched = sh(await api('POST', `/desk/tickets/${em.id}/scheduled-replies`, { idempotency_key: key, reply: { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>' }, schedule: { send_at: at } }, { 'Idempotency-Key': key })); }
// tag
const tg = await api('POST', '/desk/tags', { name: 'QA GL W2', department_id: DQ }); o.tagCreate = sh(tg); const tagId = tg.j && tg.j.data && (tg.j.data.id || (tg.j.data.tag && tg.j.data.tag.id));
if (tagId) { CREATED.push({ k: 'tag', id: tagId }); o.tagAdd = sh(await api('POST', `${P}/tags`, { tag_ids: [tagId] })); o.tagList = sh(await api('GET', `${P}/tags`)); o.tagRemove = sh(await api('DELETE', `${P}/tags/${tagId}`)); o.tagBadName = sh(await api('POST', '/desk/tags', { name: 'x', department_id: DQ })); }
// approval
const ap = await api('POST', `${P}/approvals`, { subject: 'QA GL W2 approval', description: 'test', approver_user_ids: ['87d8c554-7af9-4379-bb16-40741e109c00'] }); o.approval = sh(ap);
if (ap.s >= 400) o.approvalMe = sh(await api('POST', `${P}/approvals`, { subject: 'QA GL W2 approval', description: 'test', approver_user_ids: [ME] }));
const apl = await api('GET', `${P}/approvals`); const aps = arr(apl.j && apl.j.data); o.approvals = aps.map(a => [a.id, a.status]);
for (const a of aps.filter(a => /pending/i.test(a.status || ''))) o['apCancel_' + a.id.slice(0, 4)] = sh(await api('POST', `${P}/approvals/${a.id}/cancel`, {}));
// archive / unarchive on a closed child ticket
o.closeC1 = sh(await api('POST', `/desk/tickets/${C1}/close`, {})); o.archive = sh(await api('POST', `/desk/tickets/${C1}/archive`, {})); const ca = await api('GET', `/desk/tickets/${C1}`); o.archivedFlag = ca.s + ' ' + (ca.j && ca.j.data ? JSON.stringify({ a: ca.j.data.is_archived, st: ca.j.data.status }) : ca.t.slice(0, 120));
o.unarchive = sh(await api('POST', `/desk/tickets/${C1}/unarchive`, {}));
// macro
const mc = await api('POST', '/desk/macros', { name: 'QA GL W2 macro', department_id: DQ, actions: [{ type: 'set_status', value: 'On Hold' }, { type: 'add_comment', value: '<p>QA GL W2 macro comment</p>' }] }); o.macro = sh(mc); const mid = mc.j && mc.j.data && (mc.j.data.id || (mc.j.data.macro && mc.j.data.macro.id));
if (mid) { CREATED.push({ k: 'macro', id: mid }); o.apply = sh(await api('POST', `${P}/apply-macro`, { macro_id: mid })); const g = await getRec(T, tk); o.statusAfterMacro = g.o && g.o.status; }
// ticket template
const tt = await api('POST', '/desk/ticket-templates', { name: 'QA GL W2 template', department_id: DQ, values: { subject: 'QA GL W2 from template', priority: 'low' } }); o.template = sh(tt); const ttid = tt.j && tt.j.data && (tt.j.data.id || (tt.j.data.template && tt.j.data.template.id)); if (ttid) CREATED.push({ k: 'ticket-template', id: ttid });
return fin(o);
