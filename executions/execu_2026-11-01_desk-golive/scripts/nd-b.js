const tk = IDS.base; const P = `/desk/tickets/${tk}`; const o = {}; const K = n => ({ 'Idempotency-Key': 'qa-gl-w2n-' + n + '-' + Date.now() });
o.reply = sh(await api('POST', `${P}/replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 base ticket', body_html: '<p>QA GL W2 reply — go-live test on NDC, please ignore.</p>' }, K('r1')));
o.replyAll = sh(await api('POST', `${P}/replies`, { mode: 'reply_all', to: ['mmohamed@anyware.software'], cc: ['mahmoud.mmohamedsamy@gmail.com'], bcc: [], subject: 'Re: QA GL W2 base ticket', body_html: '<p>QA GL W2 reply all with CC.</p>' }, K('r2')));
o.forward = sh(await api('POST', `${P}/replies`, { mode: 'forward', to: ['mahmoud.mmohamedsamy@gmail.com'], cc: [], bcc: [], subject: 'Fwd: QA GL W2 base ticket', body_html: '<p>QA GL W2 forward.</p>' }, K('r3')));
o.badTo = sh(await api('POST', `${P}/replies`, { mode: 'reply', to: ['not-an-email'], cc: [], bcc: [], subject: 'x', body_html: '<p>x</p>' }, K('r4')));
o.emptyBody = sh(await api('POST', `${P}/replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'x', body_html: '' }, K('r5')));
await sleep(10000);
const lr = await api('GET', `${P}/replies`); o.replies = arr(lr.j && lr.j.data).map(r => [r.id, r.mode, r.status || r.delivery_status, (r.to || []).join(';'), (r.cc || []).join(';'), (r.body_html || '').includes('<p>') ? 'html' : '', r.signature_applied]);
o.firstReply = JSON.stringify(arr(lr.j && lr.j.data)[0] || {}).slice(0, 700);
o.ccList = sh(await api('GET', `${P}/cc`));
o.sig = sh(await api('GET', '/mail/signatures/me'));
// comments
const cm = await api('POST', `${P}/comments`, { body_html: '<p>QA GL W2 private comment</p>' }); o.comment = sh(cm); const cid = cm.j && cm.j.data && cm.j.data.id;
if (cid) { o.commentEdit = sh(await api('PUT', `${P}/comments/${cid}`, { body_html: '<p>QA GL W2 private comment edited</p>' }));
  o.pin = sh(await api('PUT', `${P}/comments/${cid}/pin`, { scope: 'all_agents' })); const pl = await api('GET', `${P}/comments`); o.pinnedSeen = JSON.stringify(arr(pl.j && pl.j.data).find(c => c.id === cid) || {}).slice(0, 400); o.unpin = sh(await api('DELETE', `${P}/comments/${cid}/pin`)); }
const mn = await api('POST', `${P}/comments`, { body_html: `<p>QA GL W2 mention <span data-type="mention" data-id="${UB}" data-label="mahmoud">@mahmoud</span> please check</p>`, mentions: [UB], mentioned_user_ids: [UB] }); o.mention = sh(mn); o.mentionData = mn.j && mn.j.data && JSON.stringify({ m: mn.j.data.mentions || mn.j.data.mentioned_user_ids, b: (mn.j.data.body_html || '').slice(0, 200) });
o.commentXss = sh(await api('POST', `${P}/comments`, { body_html: '<script>alert(1)</script><b>QA GL W2 bold</b><img src=x onerror=alert(2)>' }));
const lc = await api('GET', `${P}/comments`); o.comments = arr(lc.j && lc.j.data).map(c => [c.id, (c.body_html || '').slice(0, 140), c.is_public, c.visibility]);
if (cid) o.commentDelete = sh(await api('DELETE', `${P}/comments/${cid}`));
// draft + review
o.draftSave = sh(await api('PUT', `${P}/drafts/mine`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2', body_html: '<p>QA GL W2 draft</p>' }));
o.draftGet = sh(await api('GET', `${P}/drafts`));
o.reviewSubmit = sh(await api('POST', `${P}/drafts/mine/submit-review`, {}));
o.reviewWithdraw = sh(await api('POST', `${P}/drafts/mine/withdraw-review`, {}));
o.draftDiscard = sh(await api('DELETE', `${P}/drafts/mine`));
// scheduled reply on email ticket
const EP = `/desk/tickets/${IDS.email}`; const at = new Date(Date.now() + 86400e3).toISOString(); const key = 'qa-gl-w2n-sched-' + Date.now();
const sr = await api('POST', `${EP}/scheduled-replies`, { idempotency_key: key, reply: { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>' }, schedule: { send_at: at } }, { 'Idempotency-Key': key }); o.sched = sh(sr);
o.schedPhone = sh(await api('POST', `${P}/scheduled-replies`, { idempotency_key: key + 'p', reply: { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'x', body_html: '<p>x</p>' }, schedule: { send_at: at } }, { 'Idempotency-Key': key + 'p' }));
o.schedPast = sh(await api('POST', `${EP}/scheduled-replies`, { idempotency_key: key + 'past', reply: { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'x', body_html: '<p>x</p>' }, schedule: { send_at: new Date(Date.now() - 3600e3).toISOString() } }, { 'Idempotency-Key': key + 'past' }));
const sl = await api('GET', '/desk/scheduled-replies'); const items = (sl.j && sl.j.data && sl.j.data.scheduled_replies) || []; o.schedList = items.map(x => [x.id, x.status, x.ticket_number, x.send_at]);
for (const it of items.filter(x => x.ticket_id === IDS.email)) o['schedDel_' + it.id.slice(0, 4)] = sh(await api('DELETE', `/desk/scheduled-replies/${it.id}`));
const sl2 = await api('GET', '/desk/scheduled-replies'); o.schedAfter = ((sl2.j && sl2.j.data && sl2.j.data.scheduled_replies) || []).length;
// snippet
const body1 = '<p>Hello {{customer_name}}, ticket #{{ticket_number}} ({{department_name}})</p>';
const sn = await api('POST', '/desk/snippets', { name: 'qa_gl_w2', title: 'QA GL W2 snippet', content_html: body1, scope: 'personal' }); o.snippet = sh(sn); const sid = sn.j && sn.j.data && sn.j.data.id;
if (sid) { CREATED.push({ k: 'snippet', id: sid }); o.resolve = sh(await api('POST', `${P}/snippets/resolve`, { snippet_ids: [sid], snippet_id: sid, content_html: body1 })); o.snBadName = sh(await api('POST', '/desk/snippets', { name: 'qa gl w2 bad', title: 'x', content_html: '<p>x</p>', scope: 'personal' })); o.snDup = sh(await api('POST', '/desk/snippets', { name: 'qa_gl_w2', title: 'dup', content_html: '<p>x</p>', scope: 'personal' })); }
o.emailTpl = sh(await api('GET', `${P}/email-templates`));
return fin(o);
