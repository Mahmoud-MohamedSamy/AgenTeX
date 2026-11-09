const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {};
const PA = 'c9e96413-189a-4933-91a5-ef1d94adf798', C1 = 'f3bf9581-ca76-46a9-a56e-0d757de60b27', C2 = '36c92f6b-c2e2-41dd-b651-1f5da310355b';
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 240) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 220) : undefined });
const at = new Date(Date.now() + 86400e3).toISOString(); const key = 'qa-gl-w2-sched-' + Date.now();
o.sched = sh(await api('POST', `${P}/scheduled-replies`, { idempotency_key: key, reply: { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>' }, schedule: { send_at: at } }, { 'Idempotency-Key': key }));
const sl = await api('GET', '/desk/scheduled-replies'); const items = (sl.j && sl.j.data && sl.j.data.scheduled_replies) || []; const mine = items.find(x => x.ticket_id === tk); o.schedListed = !!mine; o.schedItem = mine && JSON.stringify(mine).slice(0, 300);
if (mine) { o.schedCancel = sh(await api('DELETE', `/desk/scheduled-replies/${mine.id}`)); const sl2 = await api('GET', '/desk/scheduled-replies'); o.schedStill = ((sl2.j && sl2.j.data && sl2.j.data.scheduled_replies) || []).filter(x => x.ticket_id === tk).map(x => x.status); }
// tags
const tg = await api('POST', '/desk/tags', { name: 'qa-gl-w2', department_id: DQ }); o.tagCreate = sh(tg); const tagId = tg.j && tg.j.data && (tg.j.data.id || (tg.j.data.tag && tg.j.data.tag.id));
if (tagId) { CREATED.push({ k: 'tag', id: tagId }); o.tagAdd = sh(await api('POST', `${P}/tags`, { tag_ids: [tagId] })); o.tagList = sh(await api('GET', `${P}/tags`)); o.tagRemove = sh(await api('DELETE', `${P}/tags/${tagId}`)); }
// parent-child
o.link = sh(await api('POST', `/desk/tickets/${PA}/children`, { child_ticket_ids: [C1, C2] })); const h = await api('GET', `/desk/tickets/${PA}/parent-child`); o.childCount = h.j && h.j.data && h.j.data.child_count;
o.unlink = sh(await api('DELETE', `/desk/tickets/${PA}/children/${C2}`)); const h2 = await api('GET', `/desk/tickets/${PA}/parent-child`); o.childCount2 = h2.j && h2.j.data && h2.j.data.child_count;
o.selfParent = sh(await api('POST', `/desk/tickets/${PA}/children`, { child_ticket_ids: [PA] }));
// attachments (record attachments API, small text)
o.attList = sh(await api('GET', `${P}/attachments`));
// timer
o.tStart = sh(await api('POST', `${P}/timer/start`, {})); await sleep(4000); o.tPause = sh(await api('POST', `${P}/timer/pause`, {})); o.tResume = sh(await api('POST', `${P}/timer/resume`, {})); await sleep(3000);
o.tStop = sh(await api('POST', `${P}/timer/stop`, { description: 'QA GL W2 timer entry' }));
// manual time entries
const te = await api('POST', `${P}/time-entries`, { duration_seconds: 1800, hours: 0, minutes: 30, work_date: new Date().toISOString().slice(0, 10), description: 'QA GL W2 manual entry' }); o.teAdd = sh(te); const teId = te.j && te.j.data && (te.j.data.id || (te.j.data.entry && te.j.data.entry.id));
if (teId) { o.teEdit = sh(await api('PUT', `${P}/time-entries/${teId}`, { duration_seconds: 2700, hours: 0, minutes: 45, work_date: new Date().toISOString().slice(0, 10), description: 'QA GL W2 manual entry edited' })); }
o.teNeg = sh(await api('POST', `${P}/time-entries`, { duration_seconds: -60, hours: 0, minutes: -1, work_date: new Date().toISOString().slice(0, 10), description: 'QA GL W2 negative' }));
o.teHuge = sh(await api('POST', `${P}/time-entries`, { duration_seconds: 90000, hours: 25, minutes: 0, work_date: new Date().toISOString().slice(0, 10), description: 'QA GL W2 25h' }));
const tl = await api('GET', `${P}/time-entries`); o.teList = arr(tl.j && tl.j.data).map(x => [x.id, x.duration_seconds || x.duration, x.billing_type || x.billable, (x.description || '').slice(0, 30)]);
if (teId) o.teDelete = sh(await api('DELETE', `${P}/time-entries/${teId}`));
// resolution
o.resEmpty = sh(await api('PUT', `${P}/resolution`, { content: '' }));
o.resSave = sh(await api('PUT', `${P}/resolution`, { content: 'QA GL W2 resolution', notify_customer: false }));
o.resEdit = sh(await api('PUT', `${P}/resolution`, { content: 'QA GL W2 resolution edited', notify_customer: false }));
o.resDelete = sh(await api('DELETE', `${P}/resolution`));
// approvals
const ap = await api('POST', `${P}/approvals`, { subject: 'QA GL W2 approval', description: 'test', approver_ids: ['87d8c554-7af9-4379-bb16-40741e109c00'] }); o.approval = sh(ap);
const apl = await api('GET', `${P}/approvals`); const aps = arr(apl.j && apl.j.data); o.approvals = aps.map(a => [a.id, a.status]);
if (aps[0]) { o.apCancel = sh(await api('POST', `${P}/approvals/${aps[0].id}/cancel`, {})); }
return fin(o);
