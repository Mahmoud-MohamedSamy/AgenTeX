const o = {}; const H = 'https://staging-desk.taviportal.com';
const P = (id, pass, note) => { result(id, pass === null ? 'INCONCLUSIVE' : pass ? 'PASS' : 'FAIL', note); o[id] = (pass === null ? 'INC ' : pass ? 'PASS ' : 'FAIL ') + note; };
ST.SUBS = ST.SUBS || {};
const HD = { Origin: H, Referer: H + '/embed/feedback/index.html' };
const submit = async (tag, extra = {}) => {
  const s = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/session`, { method: 'POST', headers: HD }); const tok = (await s.json().catch(() => ({})))?.data?.session_token;
  if (!tok) return { s: s.status };
  const subject = `QA PA WF ${tag}`;
  const values = { subject, 'contact.first_name': 'QA PA', 'contact.last_name': 'Submitter ' + tag, email: `mahmoud.mmohamedsamy+qapa${tag.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`, description: `First line of ${tag}\nsecond line`, ...extra };
  const r = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/submissions`, { method: 'POST', headers: { ...HD, 'content-type': 'application/json', 'X-Web-Form-Session': tok }, body: JSON.stringify({ submission_id: crypto.randomUUID(), values, file_ids: [], captcha_token: null, page_origin: H, elapsed_ms: 6500, visitor_id: crypto.randomUUID(), honeypot: '' }) });
  const t = await r.text(); ledger(`web form submit ${subject} -> ${r.status}`); return { s: r.status, t: t.slice(0, 300), subject };
};
const findItem = async (who, subject, list = 'waiting') => (await inbox(who, { list, q: subject, page_size: 50 })).d?.approvals?.find(x => x.submission?.subject === subject);
const pend = async subject => { const r = await api.O('GET', `/web-forms/${ST.FORM}/pending?status=pending`); const a = arr(r.j?.data?.items || r.j?.data?.pending || r.j?.data); return { s: r.s, item: a.find(x => JSON.stringify(x).includes(subject)), n: a.length, keys: Object.keys(r.j?.data || {}) }; };
const act = (who, it, action, body = {}) => { if (ST.PROTECTED.includes(it.id)) throw new Error('protected item'); return api[who]('POST', `/web-forms/${it.submission.form_id}/pending/${it.id}/${action}`, body); };
const findTicket = async subject => { for (let i = 0; i < 6; i++) { const r = await api.O('GET', `/modules/${T}/records?search=${encodeURIComponent(subject)}&page_size=20`); const x = arr(r.j?.data).find(y => JSON.stringify(y).includes(subject)); if (x) return x; await sleep(3000); } return null; };
// team back to D
o.team = E(await api.O('PUT', '/desk/teams/' + ST.TEAM, { name: 'QA PA Team', description: 'QA PA NDC-2871, delete after', department_id: ST.D1, sources: [{ kind: 'agent', ref_id: U.D }], color: 'blue', icon: 'star' }));
await sleep(2000);
// submissions
const subs = {}; for (const tag of ['G1A', 'G4', 'G7', 'G8', 'G9', 'G11', 'G12A', 'G12B', 'G3', 'GX']) subs[tag] = await submit(tag);
o.submits = Object.fromEntries(Object.entries(subs).map(([k, v]) => [k, v.s]));
await sleep(4000);
// G1/G2 held, not a ticket
const g1 = await findItem('B', 'QA PA WF G1A'); const tk1 = await findTicket('QA PA WF G1A');
P('G2', !!g1 && !tk1, `held item in B's list ${!!g1}; ticket exists ${!!tk1}; marker: ticket=${g1?.ticket}, ticket_number=${g1?.ticket_number}`);
o.B6item = JSON.stringify(g1).slice(0, 1400);
P('B6', !!(g1 && g1.submission?.form_name === 'QA PA Form' && g1.submission?.submitter_email && !g1.ticket_number), `form ${g1?.submission?.form_name}, submitter ${g1?.submission?.submitter_name} / email set ${!!g1?.submission?.submitter_email}, subject ${g1?.submission?.subject}, first line of message field present: ${'message' in (g1?.submission || {}) || 'first_line' in (g1?.submission || {}) || 'description' in (g1?.submission || {})}, no ticket number ${!g1?.ticket_number}`);
// G4 approver list per form
const inB = !!g1, inD = !!(await findItem('D', 'QA PA WF G1A')), inA = !!(await findItem('A', 'QA PA WF G1A')), inS = !!(await findItem('S', 'QA PA WF G1A'));
const canA = (await api.A('GET', '/desk/approvals/' + (g1?.id || 'x')));
P('G4', inB && inD && !inA, `in Waiting for me: B ${inB}, D (team) ${inD}, A ${inA}, S ${inS}; A detail -> ${canA.s} can_decide ${canA.j?.data?.item?.can_decide}`);
// G17 spam score
P('G17', typeof g1?.submission?.spam_score === 'number', `spam_score ${g1?.submission?.spam_score}, reason ${g1?.submission?.reason}, signals field: ${JSON.stringify(Object.keys(g1?.submission || {}).filter(k => /signal/.test(k)))}`);
// G7 reject reason required / notify submitter
const it7 = await findItem('B', 'QA PA WF G7');
const r7a = await act('B', it7, 'reject', {}); const r7b = await act('B', it7, 'reject', { reason: '' }); const r7c = await act('B', it7, 'reject', { reason: 'ab' });
const r7d = await act('B', it7, 'reject', { reason: 'QA PA rejected: duplicate request', notify_submitter: true });
const tk7 = await findTicket('QA PA WF G7');
P('G7', r7a.s >= 400 && r7b.s >= 400 && r7c.s >= 400 && r7d.s < 300 && !tk7, `no reason ${E(r7a)}; empty ${E(r7b)}; "ab" ${E(r7c)}; reason + notify ${E(r7d)}; ticket created ${!!tk7}. Email to submitter not checked (mailbox)`);
const it8 = await findItem('B', 'QA PA WF G8'); const r8 = await act('B', it8, 'reject', { reason: 'QA PA rejected silently', notify_submitter: false });
P('G8', r8.s < 300 ? null : false, `reject with reason, notify off -> ${E(r8)}; no-email part needs the mailbox (inconclusive)`);
// G9 dept + priority override
const it9 = await findItem('B', 'QA PA WF G9'); const r9 = await act('B', it9, 'approve', { department_id: ST.D2, priority: 'high' }); o.r9 = r9.t.slice(0, 600);
const tk9 = await findTicket('QA PA WF G9'); let t9 = null; if (tk9) t9 = await getTicket(tk9.id);
P('G9', r9.s < 300 && t9 && t9.department === ST.D2 && /high/i.test(t9.priority), `approve with Dept 2 + High -> ${E(r9)}; ticket ${!!tk9} dept ${t9?.department === ST.D2 ? 'D2' : t9?.department} priority ${t9?.priority} subject ${t9?.subject}`);
if (tk9) { ST.SUBS.G9 = tk9.id; ledger('ticket from G9 ' + tk9.id); }
// G11 approve creates ticket now
const it11 = await findItem('D', 'QA PA WF G11'); const r11 = await act('D', it11, 'approve', {});
const tk11 = await findTicket('QA PA WF G11'); let t11 = null; if (tk11) { t11 = await getTicket(tk11.id); ST.SUBS.G11 = tk11.id; ledger('ticket from G11 ' + tk11.id); }
const h11 = tk11 ? await api.O('GET', `/desk/tickets/${tk11.id}/history`) : null;
o.G11hist = h11 ? h11.s + ' ' + (h11.t.match(/[^"]*(web form|approv)[^"]*/gi) || []).slice(0, 6).join(' | ') : null;
P('G11', r11.s < 300 && !!tk11 && t11?.department === ST.D1, `D (team member) approves -> ${E(r11)}; ticket created ${!!tk11} dept D1 ${t11?.department === ST.D1}, status ${t11?.status}, owner ${t11?.owner || t11?.assignee || ''}; history: ${o.G11hist}`);
// G12 spam
const it12a = await findItem('B', 'QA PA WF G12A'); const r12a = await act('B', it12a, 'spam', { block_sender: false });
const it12b = await findItem('B', 'QA PA WF G12B'); const r12b = await act('B', it12b, 'spam', { block_sender: true });
o.r12b = r12b.t.slice(0, 400);
const tk12 = await findTicket('QA PA WF G12A');
P('G12', r12a.s < 300 && r12b.s < 300 && !tk12, `spam no block -> ${E(r12a)}; spam + block -> ${E(r12b)}; ticket ${!!tk12}. Block list check below`);
// G3 page vs pending tab
const pt = await pend('QA PA WF G3'); o.pendingShape = pt.s + ' keys ' + JSON.stringify(pt.keys) + ' n=' + pt.n + ' found ' + !!pt.item;
const it3 = await findItem('B', 'QA PA WF G3'); const r3 = await act('O', it3, 'reject', { reason: 'QA PA reject via pending tab' });
const st3 = (await api.O('GET', `/web-forms/${ST.FORM}/pending?status=rejected`)); const inRej = st3.t.includes('QA PA WF G3'); const it3b = await findItem('B', 'QA PA WF G3', 'decided');
P('G3', r3.s < 300 && inRej, `reject -> ${E(r3)}; in form Pending tab (rejected) ${inRej}; in B decided ${!!it3b}; G9 approved shows in form approved: ${(await api.O('GET', `/web-forms/${ST.FORM}/pending?status=approved`)).t.includes('QA PA WF G9')}`);
// B1-ish: decided list shows on-behalf? O is admin, not approver
o.G3onBehalf = JSON.stringify(it3b?.submission && { decided_by: it3b.submission.decided_by === U.O ? 'O' : it3b.submission.decided_by, on_behalf: it3b.submission.decided_on_behalf, reason: it3b.submission.decision_reason });
// G6 approver list only people with access
const f = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; const def = JSON.parse(JSON.stringify(f.definition));
def.review.approver_ids = [U.B, U.S]; const g6 = await api.O('PUT', '/web-forms/' + ST.FORM, { name: f.name, department_id: f.department_id, definition: def, row_version: f.row_version });
P('G6', g6.s >= 400, 'save approvers B + S (no Dept 1) -> ' + E(g6));
if (g6.s < 300) { def.review.approver_ids = [U.B]; const f2 = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; await api.O('PUT', '/web-forms/' + ST.FORM, { name: f2.name, department_id: f2.department_id, definition: def, row_version: f2.row_version }); }
// G5 empty approver list = anyone with web form approve
const f3 = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; const def3 = JSON.parse(JSON.stringify(f3.definition)); def3.review.approver_ids = []; def3.review.approver_team_ids = [];
const g5s = await api.O('PUT', '/web-forms/' + ST.FORM, { name: f3.name, department_id: f3.department_id, definition: def3, row_version: f3.row_version }); o.g5save = E(g5s);
await submit('G5'); await sleep(4000);
const g5 = {}; for (const k of ['A', 'B', 'D', 'O']) { const it = await findItem(k, 'QA PA WF G5'); const all = await findItem(k, 'QA PA WF G5', 'all_pending'); g5[k] = `waiting ${!!it} all ${!!all} can_decide ${(it || all)?.can_decide}`; }
P('G5', g5s.s < 300 && /can_decide true/.test(g5.O), JSON.stringify(g5));
// G14 Review = None keeps held items
const f4 = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; const def4 = JSON.parse(JSON.stringify(f4.definition)); def4.review.mode = 'none';
const g14s = await api.O('PUT', '/web-forms/' + ST.FORM, { name: f4.name, department_id: f4.department_id, definition: def4, row_version: f4.row_version });
const gx = await findItem('O', 'QA PA WF GX', 'all_pending'); const g5i = await findItem('O', 'QA PA WF G5', 'all_pending');
const r14 = gx ? await act('O', gx, 'approve', {}) : null;
P('G14', g14s.s < 300 && !!gx && !!g5i && r14?.s < 300, `Review -> None ${E(g14s)}; held GX listed ${!!gx}, G5 listed ${!!g5i}; approve GX after switch -> ${r14 ? E(r14) : 'n/a'}`);
const tkx = await findTicket('QA PA WF GX'); if (tkx) { ST.SUBS.GX = tkx.id; ledger('ticket from GX ' + tkx.id); }
// G1 modes: None -> ticket at once
await submit('G1N'); const tkn = await findTicket('QA PA WF G1N'); if (tkn) { ST.SUBS.G1N = tkn.id; ledger('ticket from G1N ' + tkn.id); }
const heldN = await findItem('O', 'QA PA WF G1N', 'all_pending');
// Spam mode threshold 90
const f5 = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; const def5 = JSON.parse(JSON.stringify(f5.definition)); def5.review.mode = 'spam'; def5.review.spam_threshold = 90;
await api.O('PUT', '/web-forms/' + ST.FORM, { name: f5.name, department_id: f5.department_id, definition: def5, row_version: f5.row_version });
await submit('G1S'); await sleep(3000); const heldS = await findItem('O', 'QA PA WF G1S', 'all_pending'); const tks = await findTicket('QA PA WF G1S'); if (tks) { ST.SUBS.G1S = tks.id; ledger('ticket from G1S ' + tks.id); }
P('G1', !!tkn && !heldN && !!g1 && !heldS && !!tks, `None -> ticket ${!!tkn}, held ${!!heldN}; Approval -> held ${!!g1}; Spam 90 with a clean submission -> held ${!!heldS}, ticket ${!!tks}`);
// put back to approval with B + team for later
const f6 = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; const def6 = JSON.parse(JSON.stringify(f6.definition)); def6.review = { ...def6.review, mode: 'approval', approver_ids: [U.B], approver_team_ids: [ST.TEAM] };
o.restore = E(await api.O('PUT', '/web-forms/' + ST.FORM, { name: f6.name, department_id: f6.department_id, definition: def6, row_version: f6.row_version }));
P('G15', null, 'expiry is 30 days (expires_at), no shorter setting found; not waited');
saveState(); return o;
