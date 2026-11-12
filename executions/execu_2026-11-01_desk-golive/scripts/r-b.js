// 12 Nov resume, agent B: W2-74 mention notification (API + bell on screen), W2-56 approve + reject on screen (card-scoped), W2-58 review approve/reject
const o = {}; const BASE = 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9', EMAIL = '9804a4f1-b4d3-4b76-8638-3837001ceedc'; const P = `/desk/tickets/${BASE}`;
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const me = await api('GET', '/iam/me'); o.me = me.j && me.j.data && (me.j.data.email || '');
const nl = await api('GET', '/notifications?limit=40'); o.notif = arr(nl.j && nl.j.data).map(n => [n.event_type, n.title, n.created_at]).filter(x => /310[5-9]|QA GL W2/.test(JSON.stringify(x))).slice(0, 12);
// bell on screen
await go('/views/all/tickets', 8000);
const bell = page.locator('button[aria-label*="otification"]').first(); o.bellBtn = await bell.count();
if (o.bellBtn) { await bell.click().catch(() => {}); await sleep(4000); const panel = page.locator('[role=dialog], [role=menu], [data-radix-popper-content-wrapper], aside').last(); o.bellText = ((await panel.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').slice(0, 700); o.shotBell = await shot('../wave2n/r-b-bell'); await page.keyboard.press('Escape'); }
// approvals on screen, each action scoped to its own card
await page.goto(H + '/views/all/tickets/' + BASE, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 r base/, 90); await sleep(3000);
const apt = page.locator('[role=tab]', { hasText: /APPROVAL/i }).first(); o.apTab = await apt.count();
const act = async (subject, verb) => {
  const card = page.locator(`xpath=//*[normalize-space(text())="${subject}"]/ancestor::*[.//button[normalize-space(.)="${verb}"]][1]`).first();
  if (!(await card.count())) return 'card not found';
  await card.locator('button', { hasText: new RegExp('^' + verb + '$') }).first().click(); await sleep(2000);
  const dlg = page.locator('[role=dialog]').last(); if (await dlg.count()) { const ta = dlg.locator('textarea').first(); if (await ta.count()) await ta.fill('QA GL W2 ' + verb.toLowerCase() + ' by B'); const b = dlg.locator('button', { hasText: new RegExp('^' + verb) }).last(); if (await b.count()) await b.click().catch(() => {}); }
  await sleep(4000); return 'clicked';
};
if (o.apTab) { await apt.click().catch(() => {}); await sleep(4000); o.shotAp = await shot('../wave2n/r-b-approvals-before');
  o.actApprove = await act('QA GL W2 r approval approve', 'Approve');
  o.actReject = await act('QA GL W2 r approval reject', 'Reject');
  o.shotAp2 = await shot('../wave2n/r-b-approvals-after'); }
const apl = await api('GET', `${P}/approvals`); o.approvals = arr(apl.j && apl.j.data).map(a => [a.subject, a.status]);
// reviews: approve base, reject email
for (const [k, id, verb] of [['base', BASE, 'approve'], ['email', EMAIL, 'reject']]) { const Q = `/desk/tickets/${id}`; const dl = await api('GET', `${Q}/drafts`); const ds = arr(dl.j && dl.j.data); o[k + 'DraftsSeen'] = [dl.s, ds.map(d => [d.review_state, d.author_user_id === ME])];
  const d = ds.find(x => x.author_user_id === ME); if (d) o[k + 'Review'] = sh(await api('POST', `${Q}/drafts/${d.id}/${verb}`, verb === 'reject' ? { note: 'QA GL W2 rejected by B', review_note: 'QA GL W2 rejected by B' } : { note: 'QA GL W2 ok' })); }
const pend = await api('GET', '/desk/reviews/pending'); o.pendingList = pend.s + ' ' + pend.t.slice(0, 300);
const tk = await api('GET', '/desk/tickets/' + EMAIL); o.emailTicket = tk.s + ' ' + (tk.j && tk.j.data ? [tk.j.data.department_id, tk.j.data.owner_id].join(' ') : '');
await sleep(5000); const el = await api('GET', `/desk/tickets/${EMAIL}/drafts`); o.emailDraftAfter = arr(el.j && el.j.data).map(d => [d.review_state, d.review_note]);
const rl = await api('GET', `${P}/replies`); o.baseReplies = arr(rl.j && rl.j.data).map(r => [r.mode, r.status, (r.subject || '').slice(0, 40)]);
return done(o);
