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
async function hook() { for (let i = 0; i < 5; i++) { try { const r = await fetch("https://webhook.site/token", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: "{}" }); const j = await r.json(); if (j.uuid) return { url: "https://webhook.site/" + j.uuid, uuid: j.uuid }; } catch (e) { } await sleep(4000); } throw new Error("webhook.site token failed"); }
async function hookReqs(h) { try { const r = await fetch(`https://webhook.site/token/${h.uuid}/requests?sorting=oldest&per_page=50`, { headers: { accept: 'application/json' } }); const j = await r.json(); return j.data || []; } catch (e) { return []; } }
const waitHook = (h, n = 1, sec = 45) => waitFor(async () => { const q = await hookReqs(h); return q.length >= n ? q : null; }, sec, 3000);
const WH = (h, body, extra) => ({ type: 'Webhook', url: h.url, method: 'POST', bodyTemplate: body || '{"subject":"${subject}","id":"${recordId}"}', headers: { 'X-QA': 'wf' }, timeoutSeconds: 10, ...(extra || {}) });
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { body_html: `<p>${text || "QA WF comment"}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
async function allRules() { const out = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); out.push(...a); if (a.length < 100) break; } return out; }
// Batch 1 (run 2): conditions, facts, "changed", related contact, One time + Field Changed, injection, kind order.
const out = {}; const R = {}; const TK = {};
const mark = FU({ qa_ndc_agency_code: 'WF' });
const FCT = (fields, o = {}) => ({ kind: 'SpecificFieldChanged', fieldName: fields[0], fieldNames: fields, fieldMatch: o.match || 'any', alsoOnCreate: !!o.onCreate });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' }, CE = { kind: 'RecordCreatedOrUpdated' };
const ev = (events, extra) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(extra || {}) } });
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const mkContact = async (name, vals) => { const v = { name, first_name: 'QA', last_name: name, email: QA_EMAIL, ...vals }; const r = await api('POST', `/modules/${CM}/records`, { data: Object.entries(v).map(([field, x]) => ({ field, value: enc(x) })) }); const id = r.j?.data?.id; if (id) ledger(`contact "${name}" ${id}`); return { s: r.s, id, err: errOf(r) }; };
const rule = async (k, trig, crit, o = {}) => { const r = await mkRule(k, trig, o.actions || [mark], { criteria: crit, ...o }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, vals, suf); TK[k] = t.id; if (!t.id) out[k + ' ticket'] = t.s + ' ' + t.err; return t.id; };
const past = new Date(Date.now() - 86400e3).toISOString(), fut = new Date(Date.now() + 5 * 86400e3).toISOString();

// ---- rules
// CL-01 All tickets (no conditions) — only in DEPT (no agents, no other tickets)
await rule('CL01', CR, null, { noGuard: true, departmentIds: [DEPT] });
// CL-03 mixed: guard AND ((priority=high AND classification=problem) OR channel=email)
await rule('CL03', CR, OR(AND(cmp('priority', 'Equal', S('high')), cmp('classification', 'Equal', S('problem'))), cmp('channel', 'Equal', S('email'))));
// CL-09 membership with zero values; empty text
await rule('CL09m', CR, mem('priority', 'In', []));
await rule('CL09t', CR, sm('description', 'Contains', ''));
// CO-86 case sensitivity
await rule('CO86cs', CR, sm('subject', 'Contains', 'co86 lower', false));
await rule('CO86ci', CR, sm('subject', 'Contains', 'co86 lower', true));
await rule('CO86eq', CR, cmp('qa_ndc_ticket', 'Equal', S('abc')));
// CO-87 Arabic, emoji, spaces, long
await rule('CO87ar', CR, sm('description', 'Contains', 'مرحبا بالعالم'));
await rule('CO87em', CR, sm('description', 'Contains', '🚀ok'));
await rule('CO87sp', CR, cmp('qa_ndc_ticket', 'Equal', S('  pad  ')));
await rule('CO87lg', CR, sm('description', 'EndsWith', 'ENDMARK'));
// CO-90 between with From later than To
const r90 = await rule('CO90', CR, AND(cmp('due_date', 'GreaterThanOrEqual', TS(fut)), cmp('due_date', 'LessThanOrEqual', TS(past))));
out['CO90 save'] = r90.s;
// TC-01 changed on create
await rule('TC01', CR, changed('priority'));
// TC-02 changed on Edit and on Field Changed
await rule('TC02e', UP, changed('priority'));
await rule('TC02f', FCT(['priority']), changed('classification'));
// TC-09 One time + Field Changed + condition
await rule('TC09', FCT(['priority']), cmp('priority', 'Equal', S('high')), { mode: 'OneTime' });
// CF-05/06/07, TC-06 facts on Edit and Ticket events
await rule('CF05e', UP, cmp('threadCount', 'GreaterThan', I(0)));
await rule('CF05b', UP, AND(cmp('threadCount', 'GreaterThanOrEqual', I(1)), cmp('threadCount', 'LessThanOrEqual', I(3))));
await rule('CF05r', ev(['agent_response']), cmp('threadCount', 'Equal', I(1)));
await rule('CF06', ev(['comment']), cmp('commentCount', 'GreaterThanOrEqual', I(2)));
await rule('CF07t', ev(['comment']), sm('recentComment', 'Contains', 'zebra', true));
await rule('CF07p', ev(['comment']), cmp('recentCommentType', 'Equal', S('private')));
await rule('TC06', ev(['comment']), AND(cmp('recentCommentType', 'Equal', S('public')), cmp('threadCount', 'GreaterThanOrEqual', I(1))));
await rule('CF05c', CR, cmp('threadCount', 'Equal', I(0)));
// CF-09 Is Overdue
await rule('CF09t', CR, cmp('isOverdue', 'Equal', B(true)));
await rule('CF09f', CR, cmp('isOverdue', 'Equal', B(false)));
// CF-11 SLA fields
await rule('CF11a', CR, AND(ex('sla_name', 'IsNull'), cmp('sla_violated', 'Equal', B(false)), cmp('sla_escalated', 'Equal', B(false))));
await rule('CF11b', UP, ex('first_response_at', 'IsNotNull'));
// TC-08 Execution time (tenant 24/7 → always business hours) on each family
await rule('TC08c', CR, cmp('executionTime', 'Equal', S('business_hours')));
await rule('TC08o', CR, cmp('executionTime', 'Equal', S('outside_business_hours')));
await rule('TC08u', UP, cmp('executionTime', 'Equal', S('business_hours')));
await rule('TC08f', FCT(['priority']), cmp('executionTime', 'Equal', S('business_hours')));
await rule('TC08e', ev(['comment']), cmp('executionTime', 'Equal', S('business_hours')));
await rule('TC08d', { kind: 'DateFieldRelative', fieldName: 'due_date', offsetSeconds: -60, offsetMode: 'wall_clock' }, cmp('executionTime', 'Equal', S('business_hours')));
// TC-07 + CF-04 related contact
const cA = await mkContact('QA WF TC07a', { title: 'QAWF TC07' }); const cB = await mkContact('QA WF TC07b', { title: 'other' });
await rule('TC07', CE, cmp('contact_id.title', 'Equal', S('QAWF TC07')));
await rule('CF04', UP, cmp('contact_id.title', 'Equal', S('QAWF NEW')));
// TC-03 On Delete with conditions
const h3 = await hook(); await rule('TC03', { kind: 'RecordDeleted' }, cmp('priority', 'Equal', S('high')), { actions: [WH(h3, '{"p":"${priority}","s":"${subject}"}')] });
// API-04 injection
const rInj = await mkRule('API04 <script>alert(1)</script>', CR, [{ type: 'AddTicketComment', commentBody: "<b>bold</b> <script>alert('x')</script> ${subject} ${nonexistent_zz} '; DROP TABLE tickets;--", commentPublic: false }]);
R.API04 = rInj.id; out['API04 save'] = rInj.s + ' ' + (rInj.err || '');
// CO-92 tag condition with a deleted tag
const tg = await api('POST', '/desk/tags', { name: 'zz wf e', department_id: DEPT2 }); const tagE = tg.j?.data?.id; out['CO92 tag'] = tg.s + ' ' + (tagE || tg.t.slice(0, 150)); if (tagE) ledger(`tag "zz wf e" ${tagE}`);
if (tagE) await rule('CO92', CR, mem('tags', 'In', [tagE]));
// API-03 kind not first (criteria + record values)
const bad = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF API03', isActive: false, mode: 'Recurring', trigger: CR, criteria: { field: 'priority', operator: 'Equal', value: { stringValue: 'high', kind: 'string' }, kind: 'Comparison' }, actions: [{ order: 0, delaySeconds: 0, ...mark }], departmentIds: [DEPT2] });
out['API03 rule kind-last'] = bad.s + ' ' + (bad.j?.data?.id ? 'saved' : bad.t.slice(0, 200)); if (bad.j?.data?.id) { ledger(`rule "QA WF API03" ${bad.j.data.id}`); await api('DELETE', '/workflow/rules/' + bad.j.data.id); }
const badT = await api('POST', `/modules/${T}/records`, { data: [{ field: 'subject', value: { value: 'QA WF API03 ticket', kind: 'string' } }, { field: 'department', value: { value: DEPT2, kind: 'string' } }, { field: 'status', value: { value: 'Open', kind: 'string' } }], layout_id: STD_LAYOUT });
out['API03 record kind-last'] = badT.s + ' ' + (badT.j?.data?.id || badT.t.slice(0, 200)); if (badT.j?.data?.id) { ledger(`ticket "QA WF API03 ticket" ${badT.j.data.id}`); TK.API03 = badT.j.data.id; }
await sleep(3000);

// ---- tickets
const D2 = { department: DEPT2 };
await tk('CL01', 'CL01x', { department: DEPT });
await tk('CL03a', 'CL03', { ...D2, priority: 'high', classification: 'problem' }, 'a'); await tk('CL03b', 'CL03', { ...D2, priority: 'high', classification: 'question' }, 'b'); await tk('CL03c', 'CL03', { ...D2, priority: 'low', channel: 'email' }, 'c');
await tk('CL09m', 'CL09m', D2); await tk('CL09t', 'CL09t', { ...D2, description: 'anything' });
await tk('CO86', 'CO86cs', D2, 'CO86 LOWER'); await tk('CO86ci', 'CO86ci', D2, 'CO86 LOWER');
await tk('CO86eq', 'CO86eq', { ...D2, qa_ndc_ticket: 'ABC' });
await tk('CO87ar', 'CO87ar', { ...D2, description: 'نص مرحبا بالعالم نص' }); await tk('CO87em', 'CO87em', { ...D2, description: 'go 🚀ok now' });
await tk('CO87sp', 'CO87sp', { ...D2, qa_ndc_ticket: '  pad  ' }); await tk('CO87sp2', 'CO87sp', { ...D2, qa_ndc_ticket: 'pad' }, 'trim');
await tk('CO87lg', 'CO87lg', { ...D2, description: 'x'.repeat(2400) + ' ENDMARK' });
await tk('CO90', 'CO90', { ...D2, due_date: new Date(Date.now() + 2 * 86400e3).toISOString() });
await tk('TC01', 'TC01', { ...D2, priority: 'high' });
await tk('TC02e', 'TC02e', D2); await tk('TC02e2', 'TC02e', D2, 'b'); await tk('TC02f', 'TC02f', D2); await tk('TC02f2', 'TC02f', D2, 'b');
await tk('TC09', 'TC09', D2);
await tk('CF05', 'CF05e', D2); await tk('CF05b', 'CF05b', D2); await tk('CF05r', 'CF05r', D2); await tk('CF06', 'CF06', D2);
await tk('CF07t', 'CF07t', D2); await tk('CF07p', 'CF07p', D2); await tk('TC06', 'TC06', D2); await tk('CF05c', 'CF05c', D2);
await tk('CF09t', 'CF09t', { ...D2, due_date: past }); await tk('CF09t2', 'CF09t', { ...D2, due_date: fut }, 'b');
await tk('CF09f', 'CF09f', { ...D2, due_date: fut }); await tk('CF11a', 'CF11a', D2); await tk('CF11b', 'CF11b', D2);
await tk('TC08c', 'TC08c', D2); await tk('TC08o', 'TC08o', D2); await tk('TC08u', 'TC08u', D2); await tk('TC08f', 'TC08f', D2); await tk('TC08e', 'TC08e', D2);
await tk('TC08d', 'TC08d', { ...D2, due_date: new Date(Date.now() + 150e3).toISOString() });
if (cA.id) { await tk('TC07a', 'TC07', { ...D2, contact_id: cA.id }); await tk('TC07b', 'TC07', { ...D2, contact_id: cB.id }, 'b'); await tk('CF04', 'CF04', { ...D2, contact_id: cB.id }); }
await tk('TC03a', 'TC03', { ...D2, priority: 'high' }, 'a'); await tk('TC03b', 'TC03', { ...D2, priority: 'low' }, 'b');
await tk('API04', 'API04x', D2);
if (tagE) await tk('CO92', 'CO92', D2);
await sleep(15000);

// ---- edits / events
await patchTicket(TK.TC02e, { priority: 'high' }); await patchTicket(TK.TC02e2, { classification: 'problem' });
await patchTicket(TK.TC02f, { priority: 'high', classification: 'problem' }); await patchTicket(TK.TC02f2, { priority: 'high' });
await patchTicket(TK.TC09, { priority: 'high' }); await sleep(6000); await patchTicket(TK.TC09, { priority: 'low' }); await sleep(6000); await patchTicket(TK.TC09, { priority: 'high' });
for (const k of ['CF05', 'CF05b', 'CF05r', 'TC06']) await reply(TK[k]);
await sleep(8000);
await patchTicket(TK.CF05, { classification: 'problem' }); await patchTicket(TK.CF05b, { classification: 'problem' });
await comment(TK.CF06, false, 'first'); await sleep(4000); await comment(TK.CF06, false, 'second');
await comment(TK.CF07t, true, 'a Zebra here'); await comment(TK.CF07p, false, 'private one'); await comment(TK.TC06, true, 'public one');
await reply(TK.CF11b); await sleep(5000); await patchTicket(TK.CF11b, { classification: 'problem' });
await patchTicket(TK.TC08u, { classification: 'problem' }); await patchTicket(TK.TC08f, { priority: 'high' }); await comment(TK.TC08e, false, 'x');
if (cB.id) { await api('PATCH', `/modules/${CM}/records/${cB.id}`, { data: [{ field: 'title', value: enc('QAWF NEW') }] }); await sleep(3000); await patchTicket(TK.CF04, { classification: 'problem' }); }
if (tagE) { const dt = await api('DELETE', '/desk/tags/' + tagE + '?confirm=true'); out['CO92 tag delete'] = dt.s; const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.CO92); out['CO92 rule after tag delete'] = g ? (g.isActive + ' ' + JSON.stringify(g.criteria).slice(0, 300)) : 'gone'; await tk('CO92b', 'CO92', D2, 'after'); }
await sleep(10000);
await delTicket(TK.TC03a); await delTicket(TK.TC03b);
await sleep(150000); // date rule at due-60 s, other instant actions

// ---- verdicts
const F = async k => fired(TK[k], R[k.replace(/\d$/, '').replace(/(a|b|c)$/, '')] || R[k]);
const f = async (tkey, rkey) => fired(TK[tkey], R[rkey]);
const v = {};
v.CL01 = await f('CL01', 'CL01');
v.CL03 = [await f('CL03a', 'CL03'), await f('CL03b', 'CL03'), await f('CL03c', 'CL03')];
v.CL09 = [await f('CL09m', 'CL09m'), await f('CL09t', 'CL09t')];
v.CO86 = { csLowerVsUpper: await f('CO86', 'CO86cs'), ciLowerVsUpper: await f('CO86ci', 'CO86ci'), equalABCvsabc: await f('CO86eq', 'CO86eq') };
v.CO87 = { arabic: await f('CO87ar', 'CO87ar'), emoji: await f('CO87em', 'CO87em'), spacesExact: await f('CO87sp', 'CO87sp'), spacesTrimmed: await f('CO87sp2', 'CO87sp'), long: await f('CO87lg', 'CO87lg'), storedSpaces: JSON.stringify((await getTicket(TK.CO87sp)).qa_ndc_ticket), longLen: ((await getTicket(TK.CO87lg)).description || '').length };
v.CO90 = await f('CO90', 'CO90');
v.TC01 = await f('TC01', 'TC01');
v.TC02 = { editPri: await f('TC02e', 'TC02e'), editCls: await f('TC02e2', 'TC02e'), fcBoth: await f('TC02f', 'TC02f'), fcPriOnly: await f('TC02f2', 'TC02f') };
v.TC09 = await f('TC09', 'TC09');
v.CF05 = { editAfterReply: await f('CF05', 'CF05e'), between: await f('CF05b', 'CF05b'), agentResp1: await f('CF05r', 'CF05r'), createZero: await f('CF05c', 'CF05c') };
v.CF06 = (await execs(TK.CF06, R.CF06)).map(outcome);
v.CF07 = { text: await f('CF07t', 'CF07t'), privType: await f('CF07p', 'CF07p') };
v.TC06 = await f('TC06', 'TC06');
v.CF09 = { trueOnPast: await f('CF09t', 'CF09t'), trueOnFuture: await f('CF09t2', 'CF09t'), falseOnFuture: await f('CF09f', 'CF09f') };
v.CF11 = { slaEmpty: await f('CF11a', 'CF11a'), firstRespAfterReply: await f('CF11b', 'CF11b'), fra: (await getTicket(TK.CF11b)).first_response_at };
v.TC08 = { create: await f('TC08c', 'TC08c'), outside: await f('TC08o', 'TC08o'), edit: await f('TC08u', 'TC08u'), field: await f('TC08f', 'TC08f'), event: await f('TC08e', 'TC08e'), date: await f('TC08d', 'TC08d') };
v.TC07 = { match: await f('TC07a', 'TC07'), other: await f('TC07b', 'TC07') };
v.CF04 = await f('CF04', 'CF04');
const q3 = await hookReqs(h3); v.TC03 = { hits: q3.length, bodies: q3.map(x => x.content).slice(0, 3) };
const ci = arr((await api('GET', `/desk/tickets/${TK.API04}/comments`)).j?.data); v.API04 = { comment: ci.map(c => c.body_html || c.content_html || c.body).slice(0, 2), ruleName: arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.API04)?.name };
if (tagE) v.CO92 = { before: await f('CO92', 'CO92'), afterDelete: await f('CO92b', 'CO92') };
out.v = v; out.R = R;
fs.writeFileSync(RUN + '/out/b1.json', JSON.stringify(out, null, 1));
return out;
