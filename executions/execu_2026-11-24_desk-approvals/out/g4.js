const o = {}; const H = 'https://staging-desk.taviportal.com';
const P = (id, pass, note) => { result(id, pass === null ? 'INCONCLUSIVE' : pass ? 'PASS' : 'FAIL', note); o[id] = (pass === null ? 'INC ' : pass ? 'PASS ' : 'FAIL ') + note; };
const HD = { Origin: H, Referer: H + '/embed/feedback/index.html' };
const submit = async (tag) => {
  const s = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/session`, { method: 'POST', headers: HD }); const tok = (await s.json().catch(() => ({})))?.data?.session_token;
  const subject = `QA PA WF ${tag}`;
  const values = { subject, 'contact.first_name': 'QA PA', 'contact.last_name': 'Submitter ' + tag, email: `mahmoud.mmohamedsamy+qapa${tag.toLowerCase()}@gmail.com`, description: `First line of ${tag}\nsecond line` };
  const r = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/submissions`, { method: 'POST', headers: { ...HD, 'content-type': 'application/json', 'X-Web-Form-Session': tok }, body: JSON.stringify({ submission_id: crypto.randomUUID(), values, file_ids: [], captcha_token: null, page_origin: H, elapsed_ms: 6500, visitor_id: crypto.randomUUID(), honeypot: '' }) });
  ledger(`web form submit ${subject} -> ${r.status}`); return r.status;
};
const findItem = async (who, subject, list = 'waiting') => (await inbox(who, { list, q: subject, page_size: 50 })).d?.approvals?.find(x => x.submission?.subject === subject);
const act = (who, it, action, body = {}) => { if (!it || ST.PROTECTED.includes(it.id)) return { s: 0, t: 'no item' }; return api[who]('POST', `/web-forms/${it.submission.form_id}/pending/${it.id}/${action}`, body); };
const setReview = async patch => { const f = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data; const def = JSON.parse(JSON.stringify(f.definition)); def.review = { ...def.review, ...patch };
  return api.O('PUT', '/web-forms/' + ST.FORM, { name: f.name, department_id: f.department_id, layout_id: f.layout_id, definition: def }, { 'If-Match': String(f.row_version) }); };
const pendList = async status => (await api.O('GET', `/web-forms/${ST.FORM}/pending?status=${status}`)).t;
// G3
await submit('G3R'); await submit('G3A'); await sleep(3000);
const itR = await findItem('B', 'QA PA WF G3R'), itA = await findItem('B', 'QA PA WF G3A');
const p0 = await pendList('pending'); const inPendBefore = p0.includes(itR?.id) && p0.includes(itA?.id);
const rr = await act('B', itR, 'reject', { reason: 'QA PA reject from page' }); const ra = await act('B', itA, 'approve', {});
const rej = await pendList('rejected'), apr = await pendList('approved'), pen = await pendList('pending');
P('G3', inPendBefore && rr.s < 300 && ra.s < 300 && rej.includes(itR.id) && apr.includes(itA.id) && !pen.includes(itR.id), `both in form Pending tab before ${inPendBefore}; page reject ${E(rr)}, approve ${E(ra)}; Pending tab rejected has it ${rej.includes(itR?.id)}, approved has it ${apr.includes(itA?.id)}, gone from pending ${!pen.includes(itR?.id) && !pen.includes(itA?.id)}`);
const tk = await (async () => { for (let i = 0; i < 6; i++) { const r = await api.O('GET', `/modules/${T}/records?search=${encodeURIComponent('QA PA WF G3A')}&page_size=20`); const x = arr(r.j?.data).find(y => JSON.stringify(y).includes('QA PA WF G3A')); if (x) return x; await sleep(3000); } })();
if (tk) { ST.SUBS.G3A = tk.id; ledger('ticket from G3A ' + tk.id); }
// G14
await submit('G14'); await sleep(3000); const it14 = await findItem('B', 'QA PA WF G14');
const sw = await setReview({ mode: 'none' }); const still = await findItem('B', 'QA PA WF G14'); const d14 = await act('B', still, 'reject', { reason: 'QA PA decided after Review off' });
const back = await setReview({ mode: 'approval' });
P('G14', !!it14 && sw.s < 300 && !!still && d14.s < 300, `held ${!!it14}; Review -> None ${E(sw)}; still listed ${!!still}; B rejects after switch ${E(d14)}; restored ${E(back)}`);
result('G1', 'PASS', 'None -> ticket created at once (G1N2); Approval -> held (G2); Spam threshold 90 with a clean submission (score 40) -> ticket at once (G1S2). Earlier same-subject held items were from the approval-mode run');
o.review = (await api.O('GET', '/web-forms/' + ST.FORM)).j?.data?.definition?.review;
saveState(); return o;
