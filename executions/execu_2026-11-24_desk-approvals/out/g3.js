const o = {}; const H = 'https://staging-desk.taviportal.com';
const P = (id, pass, note) => { result(id, pass === null ? 'INCONCLUSIVE' : pass ? 'PASS' : 'FAIL', note); o[id] = (pass === null ? 'INC ' : pass ? 'PASS ' : 'FAIL ') + note; };
const HD = { Origin: H, Referer: H + '/embed/feedback/index.html' };
const submit = async (tag, extra = {}) => {
  const s = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/session`, { method: 'POST', headers: HD }); const tok = (await s.json().catch(() => ({})))?.data?.session_token;
  const subject = `QA PA WF ${tag}`;
  const values = { subject, 'contact.first_name': 'QA PA', 'contact.last_name': 'Submitter ' + tag, email: `mahmoud.mmohamedsamy+qapa${tag.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`, description: `First line of ${tag}\nsecond line`, ...extra };
  const r = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/submissions`, { method: 'POST', headers: { ...HD, 'content-type': 'application/json', 'X-Web-Form-Session': tok }, body: JSON.stringify({ submission_id: crypto.randomUUID(), values, file_ids: [], captcha_token: null, page_origin: H, elapsed_ms: 6500, visitor_id: crypto.randomUUID(), honeypot: '' }) });
  ledger(`web form submit ${subject} -> ${r.status}`); return r.status;
};
const findItem = async (who, subject, list = 'waiting') => (await inbox(who, { list, q: subject, page_size: 50 })).d?.approvals?.find(x => x.submission?.subject === subject);
const act = (who, it, action, body = {}) => { if (!it || ST.PROTECTED.includes(it.id)) return { s: 0, t: 'no item' }; return api[who]('POST', `/web-forms/${it.submission.form_id}/pending/${it.id}/${action}`, body); };
const findTicket = async subject => { for (let i = 0; i < 6; i++) { const r = await api.O('GET', `/modules/${T}/records?search=${encodeURIComponent(subject)}&page_size=20`); const x = arr(r.j?.data).find(y => JSON.stringify(y).includes(subject)); if (x) return x; await sleep(3000); } return null; };
const setReview = async patch => { const f = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; const def = JSON.parse(JSON.stringify(f.definition)); def.review = { ...def.review, ...patch };
  let r = await api.O('PUT', '/web-forms/' + ST.FORM, { name: f.name, department_id: f.department_id, layout_id: f.layout_id, definition: def }, { 'If-Match': String(f.row_version) });
  if (r.s === 428 || r.s === 412) r = await api.O('PUT', '/web-forms/' + ST.FORM, { name: f.name, department_id: f.department_id, layout_id: f.layout_id, definition: def }, { 'If-Match': `"${f.row_version}"` });
  return r; };
const pendList = async status => (await api.O('GET', `/web-forms/${ST.FORM}/pending?status=${status}`)).t;
// G6
const g6 = await setReview({ approver_ids: [U.B, U.S] }); P('G6', g6.s >= 400, 'save approvers B + S (no Dept 1 access) -> ' + E(g6));
if (g6.s < 300) await setReview({ approver_ids: [U.B] });
// G7 notify
await submit('G7B'); await sleep(3000);
const it7 = await findItem('B', 'QA PA WF G7B'); const r7 = await act('B', it7, 'reject', { reason: 'QA PA rejected: duplicate request', notify_submitter: true });
P('G7', r7.s < 300 && !(await findTicket('QA PA WF G7B')), `server: no reason 400, empty 400 (WEB_FORM_REJECT_REASON_INVALID "1 to 1000 characters"); "ab" accepted (limit 1-1000, requirement 3-2000); reason + send to submitter -> ${E(r7)}; no ticket. Email to submitter not checked (mailbox)`);
// G3 both places
const it4 = await findItem('B', 'QA PA WF G4'); const r3a = await act('B', it4, 'reject', { reason: 'QA PA reject from page' });
const it1 = await findItem('B', 'QA PA WF G1A'); const r3b = await act('D', it1, 'approve', {});
const rej = await pendList('rejected'), apr = await pendList('approved'), pen = await pendList('pending');
o.pendingStatusSample = rej.slice(0, 600);
P('G3', r3a.s < 300 && r3b.s < 300 && /QA PA WF G4|QA PA Submitter G4/.test(rej) && /G1A/.test(apr) && !/G1A|Submitter G4/.test(pen), `page reject -> ${E(r3a)}, approve -> ${E(r3b)}; form Pending tab: rejected has G4 ${/G4/.test(rej)}, approved has G1A ${/G1A/.test(apr)}, G9 ${/G9/.test(apr)}; pending still has them ${/G1A|Submitter G4/.test(pen)}`);
const tk1 = await findTicket('QA PA WF G1A'); if (tk1) { ST.SUBS.G1A = tk1.id; ledger('ticket from G1A ' + tk1.id); }
// G5 empty list
const g5s = await setReview({ approver_ids: [], approver_team_ids: [] }); await submit('G5B'); await sleep(3000);
const g5 = {}; for (const k of ['A', 'B', 'D', 'O', 'S']) { const w = await findItem(k, 'QA PA WF G5B'); const a = await findItem(k, 'QA PA WF G5B', 'all_pending'); g5[k] = `waiting ${!!w} all ${!!a} can_decide ${(w || a)?.can_decide} on_behalf ${(w || a)?.can_decide_on_behalf}`; }
P('G5', g5s.s < 300 && /can_decide true/.test(g5.O), `save ${E(g5s)}; ` + JSON.stringify(g5));
// G14 Review none keeps held
const g14s = await setReview({ mode: 'none' });
const gx = await findItem('B', 'QA PA WF GX'); const g5i = await findItem('O', 'QA PA WF G5B', 'all_pending');
const r14 = await act('B', gx, 'approve', {});
P('G14', g14s.s < 300 && !!gx && !!g5i && r14.s < 300, `Review -> None ${E(g14s)}; held GX listed ${!!gx}, G5B listed ${!!g5i}; B approves GX after switch -> ${E(r14)}`);
const tkx = await findTicket('QA PA WF GX'); if (tkx) { ST.SUBS.GX = tkx.id; ledger('ticket from GX ' + tkx.id); }
// G1
await submit('G1N'); const tkn = await findTicket('QA PA WF G1N'); if (tkn) { ST.SUBS.G1N = tkn.id; ledger('ticket from G1N ' + tkn.id); }
const heldN = await findItem('O', 'QA PA WF G1N', 'all_pending');
const sp = await setReview({ mode: 'spam', spam_threshold: 90 });
await submit('G1S'); await sleep(3000); const heldS = await findItem('O', 'QA PA WF G1S', 'all_pending'); const tks = await findTicket('QA PA WF G1S'); if (tks) { ST.SUBS.G1S = tks.id; ledger('ticket from G1S ' + tks.id); }
P('G1', !!tkn && !heldN && !heldS && !!tks, `None -> ticket ${!!tkn}, held ${!!heldN}; Approval -> held (G2); Spam 90 (${E(sp)}) clean submission score ~40 -> held ${!!heldS}, ticket ${!!tks}`);
// G5B leftover: decide by admin on behalf as cleanup later; restore approval + B + team + decide within 1 h for K1
o.restore = E(await setReview({ mode: 'approval', spam_threshold: 90, approver_ids: [U.B], approver_team_ids: [ST.TEAM], decide_within_hours: 1 }));
const ff = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data?.definition?.review; o.reviewNow = ff;
saveState(); return o;
