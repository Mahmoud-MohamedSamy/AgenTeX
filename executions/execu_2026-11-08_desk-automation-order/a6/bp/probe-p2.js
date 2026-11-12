// Phase 2 (owner only) API probe: records how the server behaves for spec rows that need no agent account.
// Everything is created in QA WF Dept R with "QA BP " names and deleted at the end. Output: p2-results.json
// Usage: TV_CACHE=... node probe-p2.js [onlyKeys,comma]
const tv = require('./tv'); const fs = require('fs'); const crypto = require('crypto');
const { call, sleep, TICKETS, QA_DEPT } = tv;
const ME = '7017d261-36ee-4e2f-9e60-2310ece52ef8', TASKS = '479a6b72-dffc-4dc9-9166-b5b176b09648';
const DAR = 'f6cf3a84-fc16-4e33-a671-3fcb26bc1422';
const only = (process.argv[2] || '').split(',').filter(Boolean);
const R = {}; const T = []; const B = []; const W = []; const TASKIDS = []; const SLA = [];
const st = (id, extra = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'business', ...extra });
const tr = (id, from, to, during = {}, after = [], before = {}) => ({ id, name: 'QA ' + id, fromStateId: from, toStateId: to, before, during, after: { actions: after } });
const def = (name, states, transitions, extra = {}) => ({ name: 'QA BP ' + name, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
  entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + name.split(' ')[0] + ' ' }, states, transitions, ...extra });
const short = r => ({ status: r.status, body: (r.text || '').slice(0, 300) });
async function mk(d, active = true) { const r = await tv.blueprint(d, active); if (r.json && r.json.data && r.json.data.id) B.push(r.json.data.id); return r; }
async function tk(subject, extra) { const id = await tv.ticket(subject, extra); T.push(id); return id; }
async function waitSt(t, ms = 20000) { const end = Date.now() + ms; let s; do { s = await tv.stateOf(t); if (s) return s; await sleep(1500); } while (Date.now() < end); return null; }
async function fields(t) { const r = await call('GET', `/modules/${TICKETS}/records/${t}`); const m = {}; for (const x of r.json.data.data) m[x.field] = x.value && typeof x.value === 'object' && 'value' in x.value ? x.value.value : x.value; return m; }
const runBody = (exp, items = {}) => ({ run_id: crypto.randomUUID(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...items });
async function run(t, tid, exp, items) { return call('POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, runBody(exp, items)); }
async function hist(t) { const r = await call('GET', `/desk/tickets/${t}/history`); return r.json && r.json.data || []; }
const probes = {};

probes.C3 = async () => {
  const out = {};
  for (const [k, n] of [['long300', 'C3 ' + 'x'.repeat(300)], ['xss', 'C3 <img src=x onerror=alert(1)>'], ['spaces', 'C3 spaced   '], ['arabic', 'C3 مخطط اختبار 🚀']]) {
    const r = await mk(def(n, [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
    out[k] = { status: r.status, storedName: r.json && r.json.data && r.json.data.definition && r.json.data.definition.name, err: r.status >= 300 ? r.text.slice(0, 200) : undefined };
  }
  return out;
};
probes.C4 = async () => {
  const d = () => def('C4 dup', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]);
  const a = await mk(d(), false), b = await mk(d(), false); return { first: a.status, second: short(b) };
};
probes.C14 = async () => {
  const r = await mk(def('C14 unreach', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed'), tr('esc', 'Escalated', 'Closed')]), false);
  return short(r);
};
probes.G3 = async () => {
  const a = await mk(def('G3 eq', [st('Open', { slaMinutes: 120, slaPreExpiryMinutes: 120 }), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
  const b = await mk(def('G3 nolimit', [st('Open', { slaPreExpiryMinutes: 60 }), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
  const c = await mk(def('G3 bigger', [st('Open', { slaMinutes: 60, slaPreExpiryMinutes: 120 }), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
  return { warnEqualsLimit: short(a), warnNoLimit: short(b), warnBiggerThanLimit: short(c) };
};
probes.G4 = async () => {
  const out = {};
  for (const v of [0, -1, 3, 599940, 'abc', 1.5]) {
    const r = await mk(def('G4 v' + String(v).replace(/\W/g, '_'), [st('Open', { slaMinutes: v }), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
    out[String(v)] = { status: r.status, stored: r.json && r.json.data && r.json.data.definition && r.json.data.definition.states[0].slaMinutes, err: r.status >= 300 ? r.text.slice(0, 160) : undefined };
  }
  return out;
};
probes.G5 = async () => {
  const zero = await mk(def('G5 zero', [st('Open', { autoTransitionId: 'end', autoTransitionAfterMinutes: 0 }), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]), false);
  const mand = await mk(def('G5 mand', [st('Open', { autoTransitionId: 'end', autoTransitionAfterMinutes: 5 }), st('Closed', { isTerminal: true })],
    [tr('end', 'Open', 'Closed', { checklist: [{ id: 'c1', label: 'QA must', mandatory: true }] })]), false);
  const other = await mk(def('G5 other', [st('Open', { autoTransitionId: 'esc2', autoTransitionAfterMinutes: 5 }), st('Escalated'), st('Closed', { isTerminal: true })],
    [tr('go', 'Open', 'Escalated'), tr('esc2', 'Escalated', 'Closed')]), false);
  return { zeroMinutes: short(zero), mandatoryItems: short(mand), transitionFromAnotherState: short(other) };
};
probes.G9 = async () => {
  const wrong = await mk(def('G9 wrong', [st('Open', { onReplyTransitionId: 'esc2' }), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('esc2', 'Escalated', 'Closed')]), false);
  const exit = await mk(def('G9 exit', [st('Open'), st('Closed', { isTerminal: true, onReplyTransitionId: 'end' })], [tr('end', 'Open', 'Closed')]), false);
  const okd = await mk(def('G9 ok', [st('Open', { onReplyTransitionId: 'go', onRatingTransitionId: 'go' }), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed')]), false);
  return { fromAnotherState: short(wrong), onExitState: short(exit), valid: { status: okd.status, stored: okd.json && okd.json.data && okd.json.data.definition.states[0] } };
};
probes.D9 = async () => {
  const crit = { op: 'eq', field: 'priority', value: 'high' };
  const r = await mk(def('D9 crit', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })],
    [tr('hi', 'Open', 'Escalated', {}, [], { visibilityCriteria: crit }), tr('any', 'Open', 'Closed')]));
  if (r.status >= 300) return { create: short(r) };
  const low = await tk('QA BP D9 low', { priority: 'low' }); const high = await tk('QA BP D9 high', { priority: 'high' });
  await waitSt(low); await waitSt(high);
  const names = async t => ((await call('GET', `/modules/${TICKETS}/records/${t}/blueprint-transitions`)).json.data || []).map(x => x.transitionName || x.name);
  const lowNames = await names(low), highNames = await names(high);
  const runHidden = await run(low, 'hi', 'Open');
  const after = await tv.stateOf(low);
  return { storedCriteria: r.json.data.definition.transitions[0].before, lowTicketOffered: lowNames, highTicketOffered: highNames, runHiddenOnLow: short(runHidden), lowStateAfter: after && after.activeStates };
};
probes.E11 = async () => {
  const r = await mk(def('E11 opt', [st('Open'), st('Closed', { isTerminal: true })],
    [tr('end', 'Open', 'Closed', { deskItems: [{ kind: 'comment', mandatory: false }], checklist: [{ id: 'o1', label: 'QA optional', mandatory: false }] })]));
  const t = await tk('QA BP E11 t'); await waitSt(t); const x = await run(t, 'end', 'Open');
  return { runWithoutOptional: short(x), stateAfter: await tv.stateOf(t) };
};
probes.E13 = async () => {
  await mk(def('E13 xss', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed', { deskItems: [{ kind: 'comment', mandatory: true }, { kind: 'resolution', mandatory: true }] })]));
  const t = await tk('QA BP E13 t'); await waitSt(t);
  const pay = '<script>alert(1)</script><img src=x onerror=alert(2)> QA BP E13 مرحبا 🚀';
  const x = await run(t, 'end', 'Open', { comment: { content: pay, is_public: false }, resolution: { content: pay, notify_contact: false } });
  const c = await call('GET', `/desk/tickets/${t}/comments`); const f = await fields(t);
  return { run: short(x), comments: (c.text || '').slice(0, 600), resolution: f.resolution };
};
probes.E7 = async () => {
  const req = [['priority', 'pick_list'], ['due_date', 'date_time'], ['skills', 'multi_select'], ['description', 'multi_line']]
    .map(([name, k]) => ({ name, datatype: { key: k }, required: true }));
  const cr = await mk(def('E7 types', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed', { requiredFields: req })])); if (cr.status >= 300) return { create: short(cr) };
  const t1 = await tk('QA BP E7 bad'); const t2 = await tk('QA BP E7 good'); await waitSt(t1); await waitSt(t2);
  const missing = await run(t1, 'end', 'Open', { fields: { priority: 'high' } });
  const bad = await run(t1, 'end', 'Open', { fields: { priority: 'nonsense', due_date: 'not-a-date', skills: 'x', description: 'QA' } });
  const good = await run(t2, 'end', 'Open', { fields: { priority: 'high', due_date: '2026-12-01T10:00:00Z', skills: [], description: 'QA BP E7 desc' } });
  const f = await fields(t2);
  return { missingFields: short(missing), invalidValues: short(bad), stateAfterInvalid: (await tv.stateOf(t1) || {}).activeStates, valid: short(good), savedGood: { priority: f.priority, due_date: f.due_date, description: f.description, is_spam: f.is_spam, first_response_time: f.first_response_time } };
};
probes.F = async () => { // F3 notification, F4 task, F6 email, F8 order, F10 merge tokens
  const mark = 'QA BP F ' + Date.now();
  const after = [
    { kind: 'setField', field: 'description', value: 'F8-one' }, { kind: 'setField', field: 'description', value: 'F8-two' }, { kind: 'setField', field: 'description', value: 'F8-three' },
    { kind: 'sendNotification', title: mark + ' notif {{subject}}', body: 'QA body {{subject}}', notifyOwner: true },
    { kind: 'createTask', targetModuleKey: 'desk_tasks', fields: { subject: mark + ' task {{subject}}', status: 'In Progress', priority: 'normal', due_date: '2026-11-05T10:00', category: 'email' } },
    { kind: 'deskEmail', templateId: '3218ebe9-2d1d-4692-8729-fd52bbf12592', owner: true, contact: false, teamIds: [], userIds: [], roleTreeIds: [] }];
  const r = await mk(def('F after', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed', {}, after)]));
  if (r.status >= 300) return { create: short(r) };
  const t = await tk('QA BP F ticket'); await waitSt(t);
  const f0 = await fields(t);
  const x = await run(t, 'end', 'Open'); await sleep(8000);
  const f = await fields(t);
  const n = await call('GET', '/notifications?take=30'); const nd = n.json && n.json.data; const notes = (Array.isArray(nd) ? nd : (nd && (nd.items || nd.notifications)) || []).filter(z => String(z.title).includes(mark));
  const tasks = await call('GET', `/modules/${TASKS}/records?take=50&sort=-created_at`);
  const tlist = (tasks.json && (tasks.json.data.items || tasks.json.data) || []);
  const mine = tlist.filter(z => JSON.stringify(z).includes(mark)); mine.forEach(z => TASKIDS.push(z.id));
  const h = await hist(t);
  return { ownerBefore: f0.owner, run: short(x), descriptionAfter: f.description, notifications: notes.map(z => ({ title: z.title, body: z.body })), taskCount: mine.length, task: mine[0] && JSON.stringify(mine[0]).slice(0, 900),
    history: JSON.stringify(h).slice(0, 1500) };
};
probes.F9 = async () => { // workflow On Edit after transition [reg NDC-2420]
  const rule = { moduleId: TICKETS, layoutId: '', name: 'QA BP F9 rule', description: 'QA automation', mode: 'Recurring', isActive: true, trigger: { kind: 'RecordUpdated' },
    criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA BP F9 ', caseInsensitive: false },
    actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { description: { kind: 'string', stringValue: 'F9-workflow-ran' } } }] };
  const rr = await call('POST', '/workflow/rules', rule); const rid = rr.json && rr.json.data && rr.json.data.id; if (rid) W.push(rid);
  if (!rid) return { rule: short(rr) };
  await mk(def('F9 bp', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })],
    [tr('plain', 'Open', 'Escalated'), tr('req', 'Escalated', 'Closed', { requiredFields: [{ name: 'priority', datatype: { key: 'pick_list' }, required: true }] })]));
  const t = await tk('QA BP F9 t'); await waitSt(t);
  const a = await run(t, 'plain', 'Open'); await sleep(8000); const d1 = (await fields(t)).description;
  await call('PATCH', `/modules/${TICKETS}/records/${t}`, { data: [{ field: 'description', value: { kind: 'string', value: 'reset' } }] }); await sleep(6000);
  const d1b = (await fields(t)).description;
  await call('PATCH', `/modules/${TICKETS}/records/${t}`, { data: [{ field: 'description', value: { kind: 'string', value: 'reset' } }] });
  const b = await run(t, 'req', 'Escalated', { fields: { priority: 'high' } }); await sleep(8000); const d2 = (await fields(t)).description;
  const ex = await call('GET', `/workflow/executions?recordId=${t}`);
  return { ruleCreated: rr.status, runPlain: a.status, descAfterPlainTransition: d1, descAfterManualEditControl: d1b, runWithRequiredField: b.status, descAfterRequiredFieldTransition: d2, executions: (ex.text || '').slice(0, 800) };
};
probes.L1 = async () => { // workflow on create sets priority=high; blueprint criteria priority eq high
  const rule = { moduleId: TICKETS, layoutId: '', name: 'QA BP L1 rule', description: 'QA automation', mode: 'Recurring', isActive: true, trigger: { kind: 'RecordCreated' },
    criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA BP L1 ', caseInsensitive: false },
    actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { priority: { kind: 'string', stringValue: 'high' } } }] };
  const rr = await call('POST', '/workflow/rules', rule); const rid = rr.json && rr.json.data && rr.json.data.id; if (rid) W.push(rid);
  if (!rid) return { rule: short(rr) };
  const d = def('L1 bp', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]); d.entryCriteria = { op: 'eq', field: 'priority', value: 'high' };
  await mk(d);
  const t = await tk('QA BP L1 t', { priority: 'low' }); await sleep(10000);
  const f = await fields(t); const s = await tv.stateOf(t);
  return { priorityAfterCreate: f.priority, enteredBlueprint: !!s, state: s && s.activeStates };
};
probes.L3 = async () => { // workflow sets Status on a ticket in a blueprint [reg NDC-2730]
  const rule = { moduleId: TICKETS, layoutId: '', name: 'QA BP L3 rule', description: 'QA automation', mode: 'Recurring', isActive: true, trigger: { kind: 'RecordUpdated' },
    criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA BP L3 ', caseInsensitive: false },
    actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { status: { kind: 'string', stringValue: 'Closed' }, description: { kind: 'string', stringValue: 'L3-rule-ran' } } }] };
  const rr = await call('POST', '/workflow/rules', rule); const rid = rr.json && rr.json.data && rr.json.data.id; if (rid) W.push(rid);
  if (!rid) return { rule: short(rr) };
  await mk(def('L3 bp', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed')]));
  const t = await tk('QA BP L3 t'); await waitSt(t);
  const a = await run(t, 'go', 'Open'); await sleep(10000);
  const f = await fields(t); const s = await tv.stateOf(t); const ex = await call('GET', `/workflow/executions?recordId=${t}`);
  return { run: a.status, statusAfter: f.status, descriptionAfter: f.description, blueprintState: s && s.activeStates, executions: (ex.text || '').slice(0, 600) };
};
probes.L7 = async () => { // department change of a ticket in a blueprint
  await mk(def('L7 bp', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]));
  const t = await tk('QA BP L7 t', { priority: 'low' }); await waitSt(t);
  const p = await call('POST', `/desk/tickets/${t}/move`, { department_id: DAR, owner_id: null, team_id: null });
  await sleep(4000); const f = await fields(t); const s = await tv.stateOf(t);
  return { patch: short(p), departmentAfter: f.department === DAR ? 'DAR Review' : f.department === QA_DEPT ? 'QA WF Dept R' : f.department, blueprintState: s && s.activeStates, statusAfter: f.status };
};
probes.K14 = async () => { // department SLA + blueprint On Hold state
  const pol = { department_id: QA_DEPT, name: 'QA BP K14 SLA', description: 'QA automation - safe to delete', is_active: true,
    triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null },
    execute_only_with_account: false, resolution_from_created: true,
    targets: [{ name: 'QA target', sort_order: 0, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA BP K14' }], pattern: null },
      response: { value: 2, unit: 'hours' }, resolution: { value: 8, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }], accounts: [], support_plans: [] };
  const pr = await call('POST', '/desk/sla/policies', pol); const pid = pr.json && pr.json.data && pr.json.data.id; if (pid) SLA.push(pid);
  if (!pid) return { policy: short(pr) };
  await mk(def('K14 bp', [st('Open'), st('On Hold', { slaClock: 'calendar', slaMinutes: 60 }), st('Closed', { isTerminal: true })], [tr('hold', 'Open', 'On Hold'), tr('back', 'On Hold', 'Open'), tr('end', 'Open', 'Closed')]));
  const t = await tk('QA BP K14 t'); await waitSt(t); await sleep(3000);
  const s0 = await call('GET', `/desk/tickets/${t}/sla`);
  const h = await run(t, 'hold', 'Open'); await sleep(65000);
  const s1 = await call('GET', `/desk/tickets/${t}/sla`); const b1 = await tv.stateOf(t); const f1 = await fields(t);
  const re = await call('POST', `/desk/tickets/${t}/sla/reapply`, {}); await sleep(3000); const b2 = await tv.stateOf(t);
  const back = await run(t, 'back', 'On Hold'); await sleep(4000); const s2 = await call('GET', `/desk/tickets/${t}/sla`);
  return { slaBefore: (s0.text || '').slice(0, 700), runHold: h.status, statusInHold: f1.status, slaInHold: (s1.text || '').slice(0, 700), stateTimerInHold: b1 && { due: b1.escalation_due_at, entered: b1.enteredAt },
    reapply: short(re), stateAfterReapply: b2 && { states: b2.activeStates, entered: b2.enteredAt }, runBack: back.status, slaAfterBack: (s2.text || '').slice(0, 700) };
};
probes.N1 = async () => {
  const x = '<img src=x onerror=alert(1)>';
  const r = await mk(def('N1 ' + x, [st('Open'), st('Closed', { isTerminal: true })], [{ ...tr('end', 'Open', 'Closed', { checklist: [{ id: 'c', label: 'QA ' + x, mandatory: false }], messages: [{ id: 'm', text: 'QA ' + x }] }), name: 'QA ' + x }]));
  return { status: r.status, id: r.json && r.json.data && r.json.data.id };
};
probes.N2 = async () => {
  const out = {};
  const base = () => def('N2 tc', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]);
  let d = base(); d.states = { Open: {} }; out.statesAsObject = short(await mk(d, false));
  d = base(); d.transitions[0].fromStateId = 12345; out.fromIdNumber = short(await mk(d, false));
  d = base(); d.transitions[0].after.actions = [{ kind: 'noSuchAction', x: 1 }]; out.unknownActionKind = short(await mk(d, false));
  d = base(); d.transitions[0].during = { deskItems: [{ kind: 'teleport', mandatory: true }] }; out.unknownDeskItem = short(await mk(d, false));
  d = base(); d.states[0].slaMinutes = { a: 1 }; out.slaMinutesObject = short(await mk(d, false));
  d = base(); d.states = Array.from({ length: 400 }, (_, i) => st('S' + i)); out.states400 = short(await mk(d, false));
  d = base(); d.departmentId = '00000000-0000-0000-0000-000000000000'; out.unknownDepartment = short(await mk(d, false));
  return out;
};
probes.N4 = async () => {
  const rnd = crypto.randomUUID();
  const a = await call('GET', `/modules/${TICKETS}/blueprints/${rnd}`);
  await mk(def('N4 bp', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]));
  const t = await tk('QA BP N4 t'); await waitSt(t);
  const b = await run(t, 'no-such-transition', 'Open');
  const c = await call('POST', `/desk/tickets/${crypto.randomUUID()}/blueprint-transitions/end`, runBody('Open'));
  const d = await call('GET', `/modules/${TICKETS}/records/${crypto.randomUUID()}/blueprint-state`);
  return { randomBlueprint: short(a), unknownTransition: short(b), randomTicketRun: short(c), randomTicketState: short(d) };
};
probes.N8 = async () => {
  const states = [st('S0')]; const trs = [];
  for (let i = 1; i < 30; i++) states.push(st('S' + i));
  states.push(st('End', { isTerminal: true }));
  let k = 0;
  for (let i = 0; i < 30; i++) trs.push(tr('c' + i, 'S' + i, i === 29 ? 'End' : 'S' + (i + 1))); for (let i = 0; i < 30 && trs.length < 80; i++) for (const j of [i + 2, i + 3]) if (j <= 30 && trs.length < 80) trs.push(tr('t' + (k++), 'S' + i, j === 30 ? 'End' : 'S' + j));
  const t0 = Date.now(); const r = await mk(def('N8 big', states, trs), false); const createMs = Date.now() - t0;
  const id = r.json && r.json.data && r.json.data.id; let pubMs = null, pub = null, getMs = null;
  if (id) { const t1 = Date.now(); pub = await call('POST', `/modules/${TICKETS}/blueprints/${id}/publish`, {}); pubMs = Date.now() - t1; const t2 = Date.now(); await call('GET', `/modules/${TICKETS}/blueprints/${id}`); getMs = Date.now() - t2; }
  return { states: states.length, transitions: trs.length, create: r.status, createErr: r.status >= 300 ? r.text.slice(0, 400) : undefined, createMs, publish: pub && pub.status, publishMs: pubMs, getMs, id };
};
probes.N9 = async () => {
  const r = await mk(def('N9 many', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('go', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed')]), false);
  const id = r.json.data.id; const ids = [];
  for (let i = 0; i < 25; i++) ids.push(await tk('QA BP N9 t' + i));
  await call('PUT', `/modules/${TICKETS}/blueprints/${id}`, { definition: r.json.data.definition, isActive: true });
  const t0 = Date.now(); const inc = await call('POST', `/desk/blueprints/${id}/include`, { state_id: 'Escalated', ticket_ids: ids }); const incMs = Date.now() - t0;
  const list = await call('GET', `/modules/${TICKETS}/blueprints?includeInactive=true`); const row = (list.json.data || []).find(b => b.id === id);
  const t1 = Date.now(); const rev = await call('POST', `/desk/blueprints/${id}/revoke`, { ticket_ids: null, after: null }); const revMs = Date.now() - t1;
  await sleep(2000); const list2 = await call('GET', `/modules/${TICKETS}/blueprints?includeInactive=true`); const row2 = (list2.json.data || []).find(b => b.id === id);
  return { tickets: ids.length, include: short(inc), includeMs: incMs, inProgressAfterInclude: row && row.in_progress_count, revoke: short(rev), revokeMs: revMs, inProgressAfterRevoke: row2 && row2.in_progress_count };
};

(async () => {
  try {
    for (const [k, f] of Object.entries(probes)) {
      if (only.length && !only.includes(k)) continue;
      const t0 = Date.now();
      try { R[k] = await f(); } catch (e) { R[k] = { error: e.message }; if (/429/.test(e.message)) break; }
      console.log(k, Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(R[k]).slice(0, 220));
    }
  } finally {
    const log = [];
    for (const id of TASKIDS) log.push('task ' + (await call('DELETE', `/modules/${TASKS}/records/${id}`)).status);
    for (const id of W) log.push('rule ' + (await call('DELETE', `/workflow/rules/${id}`)).status);
    for (const id of SLA) log.push('sla ' + (await call('DELETE', `/desk/sla/policies/${id}`)).status);
    log.push(await tv.cleanup(T, B));
    R._cleanup = log.join(', '); console.log('cleanup', R._cleanup);
    const file = 'p2-results' + (only.length ? '-' + only.join('_') : '') + '.json';
    fs.writeFileSync(file, JSON.stringify(R, null, 2)); console.log('wrote', file);
  }
})();
