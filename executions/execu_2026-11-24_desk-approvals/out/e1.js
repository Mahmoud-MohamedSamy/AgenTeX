// E2E-4 / K7 / N4 setup: one pending item per source for B, in QA PA Dept 1.
const o = {}; ST.N = ST.N || {}; const H = 'https://staging-desk.taviportal.com';
// manual
const t1 = (await mkTicket('O', 'QA PA N manual')).id; ST.N.t1 = t1;
const r1 = await api.A('POST', `/desk/tickets/${t1}/approvals`, { subject: 'QA PA N manual request', description: 'QA PA keyboard', approver_user_ids: [U.B] }); ST.N.a1 = r1.j?.data?.id; o.manual = E(r1);
// web form
const tf = (await api.O('GET', `/web-forms/${TECH_FORM}`)).j?.data; const def = JSON.parse(JSON.stringify(tf.definition));
def.review = { mode: 'approval', spam_threshold: 90, approver_ids: [U.B], approver_team_ids: [], decide_within_hours: null }; def.allowed_origins = []; def.captcha_enabled = false;
const f = await api.O('POST', '/web-forms', { kind: tf.kind, name: 'QA PA Form N', department_id: ST.D1, layout_id: tf.layout_id, module_id: tf.module_id, definition: def, app_key: 'desk' });
ST.N.form = f.j?.data?.id; ST.N.key = f.j?.data?.embed_key; o.form = E(f); if (ST.N.form) { ledger('web form QA PA Form N ' + ST.N.form); await api.O('POST', `/web-forms/${ST.N.form}/enable`); }
const HD = { Origin: H, Referer: H + '/embed/feedback/index.html' };
const s = await fetch(`${H}/api/v1/web-forms/public/${ST.N.key}/session`, { method: 'POST', headers: HD }); const tok = (await s.json()).data.session_token;
const sub = await fetch(`${H}/api/v1/web-forms/public/${ST.N.key}/submissions`, { method: 'POST', headers: { ...HD, 'content-type': 'application/json', 'X-Web-Form-Session': tok }, body: JSON.stringify({ submission_id: crypto.randomUUID(), values: { subject: 'QA PA WF N طلب عميل', 'contact.first_name': 'QA PA', 'contact.last_name': 'N', email: 'mahmoud.mmohamedsamy+qapan@gmail.com', description: 'keyboard test' }, file_ids: [], captcha_token: null, page_origin: H, elapsed_ms: 6500, visitor_id: crypto.randomUUID(), honeypot: '' }) });
o.submit = sub.status;
// blueprint
const S_ = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const bpdef = { name: 'QA PA Refund N', description: 'QA PA NDC-2871 not-run cases - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: ST.D1, entryCriteria: { op: 'contains', field: 'subject', value: 'QA PA bpN ' },
  states: [S_('Open'), S_('On Hold', { position: { x: 300, y: 0 } }), S_('Escalated', { position: { x: 600, y: 0 } }), S_('Closed', { isTerminal: true, position: { x: 900, y: 0 } })],
  transitions: [{ id: 't_fin', name: 'Send to Finance', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: { deskItems: [{ kind: 'approval', mandatory: true, approverUserIds: [U.B] }], itemOrder: ['desk:approval'] }, after: { actions: [] } },
    { id: 't_close', name: 'Close', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
const bp = await api.O('POST', `/modules/${T}/blueprints`, { definition: bpdef, isActive: true }); ST.N.bp = bp.j?.data?.id; o.bp = E(bp); if (ST.N.bp) ledger('blueprint QA PA Refund N ' + ST.N.bp);
const t3 = (await mkTicket('A', 'QA PA bpN 1')).id; ST.N.t3 = t3; await sleep(4000);
const run = await api.A('POST', `/desk/tickets/${t3}/blueprint-transitions/t_fin`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, approval: { subject: 'QA PA N blueprint approval', description: 'QA PA keyboard', approver_user_ids: [U.B] } });
o.run = E(run); ST.N.a3 = run.j?.data?.approval_id;
await sleep(3000);
const w = (await inbox('B', { list: 'waiting', page_size: 100 })).d; o.waiting = (w?.approvals || []).map(x => x.source + ':' + (x.approval?.subject || x.submission?.subject));
ST.N.a2 = (w?.approvals || []).find(x => x.source === 'web_form')?.id;
saveState(); return o;
