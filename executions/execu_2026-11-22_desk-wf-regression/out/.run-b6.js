// Shared helpers, prepended to every case script by run.sh. Every QA rule carries the guard
// "subject starts with 'QA WF <tag> '" unless a case says noGuard (those run only on QA departments).
const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-22_desk-wf-regression';
const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const STD_LAYOUT = '1b55c25d-eb27-4046-afd1-b292398b435b';
const DEPT = 'bc53682c-7271-4fe0-8c32-99eff3a10bb1';      // QA RT19 WF Dept (main)
const DEPT2 = '4853562a-0b4d-45cb-ba34-9f2118fcd32c';     // QA AO Dept B (second)
const QA_EMAIL = 'mahmoud.mmohamedsamy+qawf@gmail.com';
const LEDGER = RUN + '/ledger.md';
const RES = RUN + '/out/results.jsonl';
const stamp = () => new Date().toISOString().slice(0, 19);
const ledger = line => fs.appendFileSync(LEDGER, `- ${stamp()} ${line}\n`);
const result = (id, verdict, note, extra) => { fs.appendFileSync(RES, JSON.stringify({ id, verdict, note, at: stamp(), ...(extra || {}) }) + '\n'); log(id, verdict, note); };

const S = v => ({ kind: 'string', stringValue: String(v) });
const I = v => ({ kind: 'int', intValue: v });
const B = v => ({ kind: 'bool', boolValue: v });
const TS = v => ({ kind: 'timestamp', timestampValue: v });
const L = (...v) => ({ kind: 'list', listValue: v.map(x => typeof x === 'object' ? x : S(x)) });
const guard = p => ({ kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: p, caseInsensitive: false });
const AND = (...ops) => ({ kind: 'Logical', operator: 'And', operands: ops });
const OR = (...ops) => ({ kind: 'Logical', operator: 'Or', operands: ops });
const NOT = op => ({ kind: 'Logical', operator: 'Not', operands: [op] });
const cmp = (field, operator, value) => ({ kind: 'Comparison', field, operator, value });
const sm = (field, operator, v, ci) => ({ kind: 'StringMatch', field, operator, stringValue: v, caseInsensitive: !!ci });
const mem = (field, operator, values) => ({ kind: 'Membership', field, operator, values: values.map(x => typeof x === 'object' ? x : S(x)) });
const ex = (field, operator) => ({ kind: 'Existence', field, operator });
const changed = field => ({ kind: 'Changed', field });

// record values: kind MUST be the first key (old bug B-1)
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'string', value: String(v) };
const dec = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(dec) : v.kind === 'object' ? v.properties : v.value;

const errOf = r => r.s >= 300 ? ((r.j && r.j.error && (r.j.error.message + ' ' + JSON.stringify(r.j.error.details || ''))) || r.t).slice(0, 400) : undefined;
async function mkRule(tag, trigger, actions, o = {}) {
  const crit = o.noGuard ? (o.criteria || null) : (o.criteria ? AND(guard(`QA WF ${tag} `), o.criteria) : guard(`QA WF ${tag} `));
  const body = { moduleId: T, name: `QA WF ${tag}`, isActive: o.active !== false, mode: o.mode || 'Recurring', trigger, criteria: crit,
    actions: actions.map((a, i) => ({ order: i, delaySeconds: 0, ...a })), departmentIds: o.departmentIds || [DEPT, DEPT2], ...(o.layoutId ? { layoutId: o.layoutId } : {}), ...(o.extra || {}) };
  const r = await api('POST', '/workflow/rules', body);
  const id = r.j && r.j.data && r.j.data.id;
  if (id) ledger(`rule "QA WF ${tag}" ${id}`);
  return { s: r.s, id, err: errOf(r), body };
}
async function mkTicket(tag, vals = {}, suffix = 'ticket') {
  const v = { subject: `QA WF ${tag} ${suffix}`.trim(), status: 'Open', department: DEPT, email: QA_EMAIL, channel: 'web', priority: 'medium', ...vals };
  const r = await api('POST', `/modules/${T}/records`, { data: Object.entries(v).filter(([k, x]) => x !== undefined && k !== '_layout').map(([field, x]) => ({ field, value: enc(x) })), layout_id: vals._layout || STD_LAYOUT });
  const id = r.j && r.j.data && r.j.data.id;
  if (id) ledger(`ticket "${v.subject}" ${id}`);
  return { s: r.s, id, err: errOf(r) };
}
const patchTicket = async (id, vals) => { const r = await api('PATCH', `/modules/${T}/records/${id}`, { data: Object.entries(vals).map(([field, x]) => ({ field, value: enc(x) })) }); return { s: r.s, err: errOf(r) }; };
const getTicket = async id => { const r = await api('GET', `/modules/${T}/records/${id}`); const o = {}; for (const x of ((r.j && r.j.data && r.j.data.data) || [])) o[x.field] = dec(x.value); o._s = r.s; return o; };
const execs = async (recordId, ruleId) => arr((await api("GET", `/workflow/executions?${ruleId ? "ruleId=" + ruleId : "recordId=" + recordId}&take=100`)).j?.data).filter(e => e.recordId === recordId); // ?recordId= alone returns [] (finding OB-03)
async function waitFor(fn, sec = 40, every = 2500) { const end = Date.now() + sec * 1000; let last; while (Date.now() < end) { last = await fn(); if (last) return last; await sleep(every); } return null; }
const waitTicket = (id, pred, sec) => waitFor(async () => { const t = await getTicket(id); return pred(t) ? t : null; }, sec);
const waitExec = (id, ruleId, sec) => waitFor(async () => { const e = await execs(id, ruleId); return e.length ? e : null; }, sec);
// quiet wait: proves something did NOT happen
async function quiet(id, ruleId, sec = 20) { await sleep(sec * 1000); return (await execs(id, ruleId)).filter(e => (e.outcome || e.status) !== 'NoMatch' && (e.outcome || e.status) !== 'no_match'); }
const outcome = e => e && (e.outcome || e.status);
// webhook.site receiver (approved 12 Oct 2026) — fresh token per case
async function hook() { for (let i = 0; i < 12; i++) { try { const r = await fetch("https://webhook.site/token", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: "{}" }); const j = await r.json(); if (j.uuid) return { url: "https://webhook.site/" + j.uuid, uuid: j.uuid }; } catch (e) { } await sleep(10000); } throw new Error("webhook.site token failed"); }
async function hookReqs(h) { try { const r = await fetch(`https://webhook.site/token/${h.uuid}/requests?sorting=oldest&per_page=50`, { headers: { accept: 'application/json' } }); const j = await r.json(); return j.data || []; } catch (e) { return []; } }
const waitHook = (h, n = 1, sec = 45) => waitFor(async () => { const q = await hookReqs(h); return q.length >= n ? q : null; }, sec, 3000);
const WH = (h, body, extra) => ({ type: 'Webhook', url: h.url, method: 'POST', bodyTemplate: body || '{"subject":"${subject}","id":"${recordId}"}', headers: { 'X-QA': 'wf' }, timeoutSeconds: 10, ...(extra || {}) });
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { body_html: `<p>${text || "QA WF comment"}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
async function allRules() { const out = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); out.push(...a); if (a.length < 100) break; } return out; }
// Batch 6 (run 2): RC-01..05/07 every allowed action for real per trigger family; MR-06 30 rules; MR-07 edit while pending;
// OB-04 execution detail; OB-07 audit; SA-01/02/05 saved actions (API); PF-01/02 timing; IN-01/02/04; E2E-02/04/05.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const C_ACT = 'ce1a9907-f037-4465-9148-b17c2e9fc33d', TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a', CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', TASKS = 'd120a6c2-2596-4254-968b-a1bcd3a000bf';
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const FCT = f => ({ kind: 'SpecificFieldChanged', fieldName: f, fieldNames: [f], fieldMatch: 'any', alsoOnCreate: false });
const ev = (events, extra) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(extra || {}) } });
const DT = sec => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: sec, offsetMode: 'wall_clock' });
const at = s => new Date(Date.now() + s * 1000).toISOString();
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions, o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const dsp = async (t, r) => (await execs(TK[t], R[r])).flatMap(e => [outcome(e), ...(e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 110) + ')' : ''))]);
// tag for Add/Remove Tags
const tg = await api('POST', '/desk/tags', { name: 'zz wf rc', department_id: DEPT2 }); const TAG = tg.j?.data?.id; out.tag = tg.s + ' ' + TAG; if (TAG) ledger(`tag "zz wf rc" ${TAG}`);
const ctc = await api('POST', `/modules/${CM}/records`, { data: [['name', 'QA WF RC contact'], ['first_name', 'QA'], ['last_name', 'QA WF RC contact'], ['email', QA_EMAIL], ['title', 'orig']].map(([f, x]) => ({ field: f, value: enc(x) })) });
const CID = ctc.j?.data?.id; if (CID) ledger(`contact "QA WF RC contact" ${CID}`);
const hk = await hook();
const A = {
  FieldUpdate: FU({ qa_ndc_company_name: 'RC' }), OwnerAssignment: { type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 },
  AddTags: { type: 'AddTags', tagIds: [TAG], mode: 'append' }, RemoveTags: { type: 'RemoveTags', tagIds: [TAG] },
  Email: { type: 'Email', emailRecipients: [{ kind: 'user', value: OWN }], emailSubject: 'QA WF RC ${subject}', emailBody: 'QA WF RC email' },
  Task: { type: 'Task', taskTitle: 'QA WF RC task ${subject}' }, Webhook: WH(hk, '{"rc":"${subject}"}'),
  CreateRecord: { type: 'CreateRecord', targetModuleId: CM, fieldMappings: { name: S('QA WF RC made ${subject}'), last_name: S('QA WF RC made') } },
  SendHappinessEmail: { type: 'SendHappinessEmail' }, UpdateRelatedRecord: { type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('QA WF RC ${priority}') } },
  AddTicketComment: { type: 'AddTicketComment', commentBody: 'QA WF RC comment', commentPublic: false }, SendTicketReply: { type: 'SendTicketReply', replyIncludeContact: true, replyTo: [], replySubject: '', replyBody: 'QA WF RC reply' },
  AddTicketFollowers: { type: 'AddTicketFollowers', followerUserIds: [TU1] }, ShareTicket: { type: 'ShareTicket', shareDepartmentId: DEPT, shareAccess: 'read_only' },
  ChangeTicketLayout: { type: 'ChangeTicketLayout', ticketLayoutId: TLR }, RunCustomAction: { type: 'RunCustomAction', customActionId: C_ACT, customActionInputs: { ref: '${recordId}', note: 'RC' } },
  RecalculateTicketSkills: { type: 'RecalculateTicketSkills' }, ReassignTicketBySkills: { type: 'ReassignTicketBySkills' },
  MarkTicketSpam: { type: 'MarkTicketSpam', spamContact: false },
};
// pack: up to 10 actions per rule; OwnerAssignment/RemoveTags/SendHappinessEmail once per rule; MarkSpam last pack alone (spam stops later events)
const packs = [['FieldUpdate', 'OwnerAssignment', 'AddTags', 'Email', 'Task', 'Webhook', 'CreateRecord', 'SendHappinessEmail', 'UpdateRelatedRecord', 'AddTicketComment'],
  ['SendTicketReply', 'AddTicketFollowers', 'ShareTicket', 'RunCustomAction', 'RecalculateTicketSkills', 'ReassignTicketBySkills', 'RemoveTags', 'ChangeTicketLayout']];
const fam = { RC01: CR, RC02: FCT('priority'), RC03: ev(['comment']) };
for (const [k, trig] of Object.entries(fam)) for (let p = 0; p < packs.length; p++) await rule(`${k}p${p}`, trig, packs[p].map(n => A[n]), { noGuard: true, criteria: guard(`QA WF ${k} `) });
await rule('RC01spam', CR, [A.MarkTicketSpam], { noGuard: true, criteria: guard('QA WF RC01spam ') });
const del5 = ['Email', 'Task', 'Webhook', 'CreateRecord', 'RunCustomAction'];
await rule('RC04', DT(-60), del5.map(n => A[n]), { noGuard: true, criteria: guard('QA WF RC04 ') });
await rule('RC05', { kind: 'RecordDeleted' }, del5.map(n => A[n]), { noGuard: true, criteria: guard('QA WF RC05 ') });
// RC-07 each action as scheduled (+60 s) under record + ticket-event trigger
await rule('RC07r', CR, ['FieldUpdate', 'AddTicketComment', 'Task', 'Webhook', 'AddTags'].map(n => ({ ...A[n], delaySeconds: 60 })), { noGuard: true, criteria: guard('QA WF RC07r ') });
await rule('RC07e', ev(['comment']), ['FieldUpdate', 'AddTicketComment', 'Task', 'Webhook'].map(n => ({ ...A[n], delaySeconds: 60 })), { noGuard: true, criteria: guard('QA WF RC07e ') });
// MR-06: 30 active rules on one trigger
for (let i = 0; i < 30; i++) { const r = await mkRule('MR06 r' + i, CR, [{ type: 'AddTicketComment', commentBody: 'MR06 ' + i, commentPublic: false }], { noGuard: true, criteria: guard('QA WF MR06 ') }); R['MR06_' + i] = r.id; }
// MR-07: rule edited while a scheduled action is pending
await rule('MR07', CR, [{ ...FU({ qa_ndc_company_name: 'MR07-v1' }), delaySeconds: 90 }]);
// SA: saved action
const sa = await api('POST', '/workflow/actions', { name: 'QA WF SA comment', moduleId: T, type: 'AddTicketComment', definition: { type: 'AddTicketComment', commentBody: 'QA WF saved', commentPublic: false } });
const SA = sa.j?.data?.id; out.saCreate = sa.s + ' ' + (SA || sa.t.slice(0, 250)); if (SA) ledger(`saved action "QA WF SA comment" ${SA}`);
out.saList = (await api('GET', '/workflow/actions?moduleId=' + T)).s + ' / other module filter ' + arr((await api('GET', '/workflow/actions?moduleId=' + CM)).j?.data).filter(a => /QA WF/.test(a.name)).length;
// IN-01: workflow owner vs assignment rule on create (direct rule → DEV2, workflow → TU1)
const ar = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA WF IN01 ar', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF IN01 ' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: DEV2, team_id: null } }] });
const AR = ar.j?.data?.id || ar.j?.data?.rule?.id; out.in01ar = ar.s + ' ' + (AR || ar.t.slice(0, 160)); if (AR) ledger(`assignment rule "QA WF IN01 ar" ${AR}`);
const ns = (await api('GET', '/desk/assignment/notification-settings')).j?.data; out.directSwitch = JSON.stringify(ns).slice(0, 200);
await rule('IN01', CR, [A.OwnerAssignment]);
// IN-02: FU priority → SLA? (no SLA policy in Dept B: record sla_name before/after)
await rule('IN02', CR, [FU({ priority: 'urgent' })]);
// E2E-02 spam journey: subject contains unsubscribe → spam + contact
await rule('E2E02', CR, [{ type: 'MarkTicketSpam', spamContact: true }], { noGuard: true, criteria: AND(guard('QA WF E2E02'), sm('subject', 'Contains', 'unsubscribe', true)) });
// E2E-04 department journey: rule only in DEPT2 fires after move from DEPT; share back to DEPT read-only
await rule('E2E04b', FCT('department'), [{ type: 'ShareTicket', shareDepartmentId: DEPT, shareAccess: 'read_only' }, FU({ qa_ndc_company_name: 'B' })], { departmentIds: [DEPT2] });
await rule('E2E04a', UP, [FU({ qa_ndc_agency_code: 'A-ONLY' })], { departmentIds: [DEPT], noGuard: true, criteria: guard('QA WF E2E04b ') });
// E2E-05: webhook → receiver patches ticket via API → Edit rule fires once, no loop
const h5 = await hook();
await rule('E2E05c', CR, [WH(h5, '{"id":"${recordId}"}')]);
await rule('E2E05e', UP, [FU({ qa_ndc_company_name: 'E2E05-edit' })], { criteria: cmp('qa_ndc_agency_code', 'Equal', S('FROM-RECEIVER')) });
// PF-01: 20 tickets, time to Field Update
await rule('PF01', CR, [FU({ qa_ndc_company_name: 'PF' })]);
await sleep(3000);

// ---------- tickets / events
const t0 = Date.now();
for (const k of ['RC01', 'RC02', 'RC03']) await tk(k, k, { contact_id: CID });
await tk('RC01spam', 'RC01spam'); await tk('RC04', 'RC04', { due_date: at(120) }); await tk('RC05', 'RC05');
await tk('RC07r', 'RC07r'); await tk('RC07e', 'RC07e');
await tk('MR06', 'MR06'); await tk('MR07', 'MR07');
await tk('IN01', 'IN01'); await tk('IN02', 'IN02', { priority: 'low' });
await tk('E2E02', 'E2E02', {}, 'please UNSUBSCRIBE me'); await tk('E2E02c', 'E2E02', {}, 'normal');
await tk('E2E04', 'E2E04b', { department: DEPT });
await tk('E2E05', 'E2E05c');
const pf = []; for (let i = 0; i < 20; i++) { const s = Date.now(); const id = await tk('PF' + i, 'PF01', {}, 'n' + i); pf.push({ id, s }); }
await sleep(8000);
await patchTicket(TK.RC02, { priority: 'high' });
await comment(TK.RC03, false, 'RC03 event'); await comment(TK.RC07e, false, 'RC07e event');
// MR-07: edit rule while pending (change value to v2)
{ const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.MR07); if (g) { const pu = await api('PUT', '/workflow/rules/' + R.MR07, { moduleId: T, name: g.name, isActive: true, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: [{ order: 0, delaySeconds: 90, ...FU({ qa_ndc_company_name: 'MR07-v2' }) }], departmentIds: g.departmentIds, version: g.version }); out.mr07put = pu.s + ' ' + (pu.s >= 300 ? pu.t.slice(0, 150) : ''); } }
// E2E-04: move to DEPT2
const mv = await api('POST', `/desk/tickets/${TK.E2E04}/move`, { department_id: DEPT2 }); out.e2e04move = mv.s;
// E2E-05 receiver: wait for the webhook, then patch as the receiver would
const w5 = await waitHook(h5, 1, 60); if (w5) { const body = JSON.parse(w5[0].content || '{}'); out.e2e05recv = body.id === TK.E2E05; await patchTicket(body.id || TK.E2E05, { qa_ndc_agency_code: 'FROM-RECEIVER' }); }
// PF-01 timing
const lat = []; for (const p of pf) { const end = Date.now() + 60000; let d = null; while (Date.now() < end) { const g = await getTicket(p.id); if (g.qa_ndc_company_name === 'PF') { d = Date.now() - p.s; break; } await sleep(1000); } lat.push(d); }
out.PF01 = { latenciesMs: lat, max: Math.max(...lat.map(x => x || 999999)) };
await delTicket(TK.RC05);
await sleep(150000);

// ---------- verdicts
const v = {};
for (const k of ['RC01', 'RC02', 'RC03']) v[k] = { p0: await dsp(k, k + 'p0'), p1: await dsp(k, k + 'p1') };
{ const g = await getTicket(TK.RC01); v.RC01ticket = { owner: g.owner, tags: g.tags, layout: g.layout_id, company: g.qa_ndc_company_name, followers: g.followers, shared: g.shared_departments }; }
v.RC01spam = { run: await dsp('RC01spam', 'RC01spam'), spam: (await getTicket(TK.RC01spam)).is_spam };
v.RC04 = await dsp('RC04', 'RC04'); v.RC05 = await dsp('RC05', 'RC05');
v.RC07 = { r: await dsp('RC07r', 'RC07r'), e: await dsp('RC07e', 'RC07e'), comp: (await getTicket(TK.RC07r)).qa_ndc_company_name };
v.hookCount = (await hookReqs(hk)).length;
{ let n = 0; for (let i = 0; i < 30; i++) n += await fired(TK.MR06, R['MR06_' + i]); const c = arr((await api('GET', `/desk/tickets/${TK.MR06}/comments?take=100`)).j?.data).length; v.MR06 = { firedRules: n, comments: c }; }
v.MR07 = { value: (await getTicket(TK.MR07)).qa_ndc_company_name, put: out.mr07put, run: await dsp('MR07', 'MR07') };
{ const e = (await execs(TK.RC01, R.RC01p0))[0]; v.OB04 = e ? { keys: Object.keys(e), dispatchKeys: Object.keys((e.dispatches || [])[0] || {}), sample: (e.dispatches || []).find(d => d.actionType === 'Webhook') } : 'no exec'; }
{ const g = await getTicket(TK.IN01); v.IN01 = { owner: g.owner === TU1 ? 'TU1 (workflow)' : g.owner === DEV2 ? 'DEV2 (assignment rule)' : g.owner, run: await dsp('IN01', 'IN01') }; }
{ const g = await getTicket(TK.IN02); v.IN02 = { priority: g.priority, sla: g.sla_name, response_due: g.response_due }; }
v.E2E02 = { spam: (await getTicket(TK.E2E02)).is_spam, control: (await getTicket(TK.E2E02c)).is_spam, run: await dsp('E2E02', 'E2E02') };
{ const g = await getTicket(TK.E2E04); v.E2E04 = { dept: g.department === DEPT2, shared: g.shared_departments, company: g.qa_ndc_company_name, aOnly: g.qa_ndc_agency_code, runB: await dsp('E2E04', 'E2E04b'), runA: await dsp('E2E04', 'E2E04a') }; }
{ const g = await getTicket(TK.E2E05); v.E2E05 = { recv: out.e2e05recv, company: g.qa_ndc_company_name, editRuns: (await execs(TK.E2E05, R.E2E05e)).map(outcome), hooks: (await hookReqs(h5)).length }; }
// OB-07 audit entries for rules
const au = await api('GET', '/audit/events?limit=100&app_key=workflow'); v.OB07 = au.s + ' ' + JSON.stringify(arr(au.j?.data).slice(0, 40).map(e => e.action + ' ' + (e.target_label || '')).filter(x => /QA WF/.test(x)).slice(0, 12));
out.v = v; out.R = R; out.TK = TK; out.ids = { TAG, CID, SA, AR }; out.t = Date.now() - t0;
fs.writeFileSync(RUN + '/out/b6.json', JSON.stringify(out, null, 1));
return out;
