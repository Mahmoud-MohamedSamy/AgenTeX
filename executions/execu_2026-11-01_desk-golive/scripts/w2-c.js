const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {};
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 260) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 260) : undefined });
// W2-18 reply
const rep = await api('POST', `${P}/replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 base ticket', body_html: '<p>QA GL W2 reply — go-live test, please ignore.</p>' }, { 'Idempotency-Key': 'qa-gl-w2-rep-1-' + Date.now() });
o.reply = sh(rep); o.replyId = rep.j && rep.j.data && rep.j.data.id;
// W2-19 reply all with CC
const ra = await api('POST', `${P}/replies`, { mode: 'reply_all', to: ['mmohamed@anyware.software'], cc: ['mahmoud.mmohamedsamy@gmail.com'], bcc: [], subject: 'Re: QA GL W2 base ticket', body_html: '<p>QA GL W2 reply all with CC.</p>' }, { 'Idempotency-Key': 'qa-gl-w2-rep-2-' + Date.now() });
o.replyAll = sh(ra);
// W2-20 forward
const fw = await api('POST', `${P}/replies`, { mode: 'forward', to: ['mahmoud.mmohamedsamy@gmail.com'], cc: [], bcc: [], subject: 'Fwd: QA GL W2 base ticket', body_html: '<p>QA GL W2 forward.</p>' }, { 'Idempotency-Key': 'qa-gl-w2-rep-3-' + Date.now() });
o.forward = sh(fw);
// W2-21 negatives
o.badTo = sh(await api('POST', `${P}/replies`, { mode: 'reply', to: ['not-an-email'], cc: [], bcc: [], subject: 'x', body_html: '<p>x</p>' }, { 'Idempotency-Key': 'qa-gl-w2-rep-4-' + Date.now() }));
o.emptyBody = sh(await api('POST', `${P}/replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'x', body_html: '' }, { 'Idempotency-Key': 'qa-gl-w2-rep-5-' + Date.now() }));
await sleep(8000);
const lr = await api('GET', `${P}/replies`); const reps = arr(lr.j && lr.j.data); o.replies = reps.map(r => [r.id, r.mode || r.direction, r.status || r.delivery_status, (r.to || []).join(';'), (r.cc || []).join(';'), r.is_public]);
const cc = await api('GET', `${P}/cc`); o.ccList = sh(cc);
// W2-22 comment add/edit/delete; W2-80 html; W2-23 mention text
const cm = await api('POST', `${P}/comments`, { body_html: '<p>QA GL W2 private comment</p>' }); o.comment = sh(cm); const cid = cm.j && cm.j.data && cm.j.data.id;
if (cid) { o.commentEdit = sh(await api('PUT', `${P}/comments/${cid}`, { body_html: '<p>QA GL W2 private comment edited</p>' }));
  o.pin = sh(await api('PUT', `${P}/comments/${cid}/pin`, { scope: 'all_agents' })); o.unpin = sh(await api('DELETE', `${P}/comments/${cid}/pin`)); }
const cx = await api('POST', `${P}/comments`, { body_html: '<script>alert(1)</script><b>QA GL W2 bold</b><img src=x onerror=alert(2)>' }); o.commentXss = sh(cx);
const lc = await api('GET', `${P}/comments`); o.comments = arr(lc.j && lc.j.data).map(c => [c.id, (c.body_html || '').slice(0, 120), c.is_public, c.visibility]);
if (cid) o.commentDelete = sh(await api('DELETE', `${P}/comments/${cid}`));
// W2-25 draft
o.draftSave = sh(await api('PUT', `${P}/drafts/mine`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2', body_html: '<p>QA GL W2 draft</p>' }));
o.draftList = sh(await api('GET', `${P}/drafts`));
// W2-57 review: submit then withdraw
o.reviewSubmit = sh(await api('POST', `${P}/drafts/mine/submit-review`, {}));
o.reviewWithdraw = sh(await api('POST', `${P}/drafts/mine/withdraw-review`, {}));
o.draftDiscard = sh(await api('DELETE', `${P}/drafts/mine`));
// W2-26 scheduled reply
const at = new Date(Date.now() + 86400e3).toISOString();
const sr = await api('POST', `${P}/scheduled-replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>', send_at: at, scheduled_at: at }); o.sched = sh(sr);
const sl = await api('GET', '/desk/scheduled-replies'); o.schedList = sh(sl);
return fin(o);
