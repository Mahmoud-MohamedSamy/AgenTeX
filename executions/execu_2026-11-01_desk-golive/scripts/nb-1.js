// Agent B (mahmoud.mahamed1515@gmail.com): notifications (W2-74/75), approvals (W2-56), review (W2-58), collision setup (W2-51)
const o = {}; const P = `/desk/tickets/${IDS.base}`;
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const me = await api('GET', '/iam/me'); o.me = me.j && me.j.data && me.j.data.email;
o.unread = sh(await api('GET', '/notifications/unread-count'));
const nl = await api('GET', '/notifications?limit=40'); const ns = arr(nl.j && nl.j.data); o.notifKeys = ns[0] ? Object.keys(ns[0]).join(',') : '';
o.notifQA = ns.map(n => [n.title || n.type || n.key, (n.body || n.message || '').slice(0, 80), n.created_at]).filter(x => /78[1-9]|79\d|QA GL W2|approval|review|mention|assign/i.test(JSON.stringify(x))).slice(0, 15);
// approvals
const apl = await api('GET', `${P}/approvals`); const aps = arr(apl.j && apl.j.data); o.approvalsSeen = aps.map(a => [a.subject, a.status]);
const aa = aps.find(a => /approval approve$/.test(a.subject || '')), ar = aps.find(a => /approval reject$/.test(a.subject || ''));
// approve through the screen if possible
await page.goto(H + '/views/all/tickets/' + IDS.base, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 90); await sleep(2500);
o.pageForB = (await txt()).replace(/\s+/g, ' ').slice(0, 200);
const apt = page.locator('[role=tab]', { hasText: /APPROVAL/i }).first(); if (await apt.count()) { await apt.click().catch(() => {}); await sleep(4000); o.approvalTabB = (await txt()).replace(/\s+/g, ' ').match(/QA GL W2 approval approve.{0,300}/)?.[0]; o.apButtons = await page.$$eval('button', bs => bs.filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(x => /approve|reject|decline/i.test(x))); o.shotApB = await shot('../wave2n/ui-b-approvals');
  const card = page.locator('div', { hasText: /^QA GL W2 approval approve/ }).last(); const btn = page.locator('button', { hasText: /^Approve$/ }).first();
  if (await btn.count()) { await btn.click().catch(() => {}); await sleep(2000); const dlg = page.locator('[role=dialog] button', { hasText: /^Approve$/ }).first(); if (await dlg.count()) { const ta = page.locator('[role=dialog] textarea').first(); if (await ta.count()) await ta.fill('QA GL W2 approved by B'); await dlg.click().catch(() => {}); } await sleep(4000); o.shotApprovedB = await shot('../wave2n/ui-b-approved'); } }
let apl2 = await api('GET', `${P}/approvals`); o.afterUiApprove = arr(apl2.j && apl2.j.data).map(a => [a.subject, a.status]);
if (aa && !/approved/i.test(JSON.stringify(o.afterUiApprove.find(x => /approve$/.test(x[0])) || ''))) o.approveApi = sh(await api('POST', `${P}/approvals/${aa.id}/approve`, { comment: 'QA GL W2 approved by B' }));
if (ar) o.rejectApi = sh(await api('POST', `${P}/approvals/${ar.id}/reject`, { comment: 'QA GL W2 rejected by B' }));
if (ar) o.rejectAgain = sh(await api('POST', `${P}/approvals/${ar.id}/approve`, { comment: 'flip' }));
apl2 = await api('GET', `${P}/approvals`); o.approvalsFinal = arr(apl2.j && apl2.j.data).map(a => [a.subject, a.status, a.decided_by || a.decision && a.decision.by]);
// review drafts
for (const [k, id, act] of [['base', IDS.base, 'approve'], ['email', IDS.email, 'reject']]) { const Q = `/desk/tickets/${id}`; const dl = await api('GET', `${Q}/drafts`); const ds = arr(dl.j && dl.j.data); o[k + 'DraftsSeen'] = ds.map(d => [d.id, d.review_state, d.author_user_id === ME]);
  const d = ds.find(x => x.author_user_id === ME); if (d) o[k + 'Review_' + act] = sh(await api('POST', `${Q}/drafts/${d.id}/${act}`, act === 'reject' ? { note: 'QA GL W2 rejected by B', review_note: 'QA GL W2 rejected by B' } : { note: 'QA GL W2 ok' })); }
await sleep(8000); const rl = await api('GET', `${P}/replies`); o.baseRepliesAfter = arr(rl.j && rl.j.data).map(r => [r.mode, r.status, (r.subject || '').slice(0, 40), r.from_user_id === ME ? 'owner' : r.from_user_id]);
const el = await api('GET', `/desk/tickets/${IDS.email}/drafts`); o.emailDraftAfter = arr(el.j && el.j.data).map(d => [d.review_state, d.review_note]);
// collision: open the base ticket and start a reply, leave the composer open
await page.goto(H + '/views/all/tickets/' + IDS.base, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 90); await sleep(2000);
const ra = page.locator('button', { hasText: /^Reply All|^Reply/ }).first(); if (await ra.count()) { await ra.click().catch(() => {}); await sleep(2500); const e = page.locator('[contenteditable=true]').last(); if (await e.count()) { await e.click().catch(() => {}); await page.keyboard.type('QA GL W2 B typing', { delay: 40 }); } }
o.hb = sh(await api('POST', `${P}/viewers/heartbeat`, { replying: true }));
o.shotBReply = await shot('../wave2n/ui-b-replying');
return done(o);
