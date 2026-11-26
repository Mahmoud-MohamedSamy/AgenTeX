const o = {};
result('E17', 'FAIL', 'B cancels A request 403, A cancels decided 409 (ok); but A (requester) CAN cancel a blueprint approval: can_cancel true, cancel 200 (requirement: blueprint items end only by revoking the transition)');
o.before = (await api.O('GET', '/desk/settings/approvals')).j?.data;
for (const v of [1, 0.5, 2]) { const r = await api.O('PUT', '/desk/settings/approvals', { default_limit_hours: v, escalation_enabled: true }); o['put' + v] = E(r); if (r.s < 300 && v === 1) break; }
o.after = (await api.O('GET', '/desk/settings/approvals')).j?.data;
o.S_put = E(await api.S('PUT', '/desk/settings/approvals', { default_limit_hours: 5, escalation_enabled: true }));
o.B_get = E(await api.B('GET', '/desk/settings/approvals'));
// K items: fresh requests now, clock starts
const mkr = async (k, tk, approvers) => { const r = await api.A('POST', `/desk/tickets/${ST.tickets[tk]}/approvals`, { subject: 'QA PA ' + k, approver_user_ids: approvers }); ST.K = ST.K || {}; ST.K[k] = { id: r.j?.data?.id, t: ST.tickets[tk], at: new Date().toISOString(), due: null }; ledger('approval ' + k + ' ' + r.j?.data?.id); return r; };
await mkr('K1 default', 'QA PA T10', [U.B]); await mkr('K3 remind', 'QA PA T11', [U.B, U.D]);
const it = (await api.B('GET', '/desk/approvals/' + ST.K['K1 default'].id)).j?.data?.item; o.K1due = it?.due_at + ' requested ' + it?.requested_at;
// form item with decide_within 1h
const H = 'https://staging-desk.taviportal.com', HD = { Origin: H, Referer: H + '/embed/feedback/index.html' };
const s = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/session`, { method: 'POST', headers: HD }); const tok = (await s.json()).data.session_token;
const r = await fetch(`${H}/api/v1/web-forms/public/${ST.FORM_KEY}/submissions`, { method: 'POST', headers: { ...HD, 'content-type': 'application/json', 'X-Web-Form-Session': tok }, body: JSON.stringify({ submission_id: crypto.randomUUID(), values: { subject: 'QA PA WF K1 form', 'contact.first_name': 'QA PA', 'contact.last_name': 'K1', email: 'mahmoud.mmohamedsamy+qapak1@gmail.com', description: 'K1 form limit' }, file_ids: [], captcha_token: null, page_origin: H, elapsed_ms: 6500, visitor_id: crypto.randomUUID(), honeypot: '' }) });
o.formSubmit = r.status; await sleep(3000);
const fi = (await inbox('B', { list: 'waiting', q: 'QA PA WF K1 form' })).d?.approvals?.[0]; o.formDue = fi?.due_at + ' requested ' + fi?.requested_at; ST.K['K1 form'] = { id: fi?.id };
saveState(); return o;
