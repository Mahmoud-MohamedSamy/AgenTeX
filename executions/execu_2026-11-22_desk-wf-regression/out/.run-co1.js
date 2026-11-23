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
  const r = await api('POST', `/modules/${T}/records`, { data: Object.entries(v).filter(([, x]) => x !== undefined).map(([field, x]) => ({ field, value: enc(x) })), layout_id: vals._layout || STD_LAYOUT });
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
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { content_html: `<p>${text || 'QA WF comment'}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
// CO batch 1: each operator = 1 rule (On Create, or On Edit for "changed"), a matching ticket M and a non-matching ticket N.
const mark = FU({ qa_ndc_company_name: 'WFHIT' });
const D = d => TS(d + 'T00:00:00'), DTV = d => TS(d);
const btw = (f, lo, hi) => AND(cmp(f, 'GreaterThanOrEqual', lo), cmp(f, 'LessThanOrEqual', hi));
const nbtw = (f, lo, hi) => OR(cmp(f, 'LessThan', lo), cmp(f, 'GreaterThan', hi));
const tf = 'qa_ndc_agency_code', nf = 'qa_ndc_agent_id', cb = 'checkbox_displayed_by_layout_rules', df = 'qa_ndc_issue_date', dt = 'due_date';
// [id, label, criteria, M values, N values, edit]  edit: {M:{...}, N:{...}} applied after create (On Edit rule)
const C = [
 ['T1', 'text equals', cmp(tf, 'Equal', S('ABC')), { [tf]: 'ABC' }, { [tf]: 'XYZ' }],
 ['T2', 'text does not equal', cmp(tf, 'NotEqual', S('ABC')), { [tf]: 'XYZ' }, { [tf]: 'ABC' }],
 ['T3', 'text contains', sm(tf, 'Contains', 'BC'), { [tf]: 'ABCD' }, { [tf]: 'XYZ' }],
 ['T4', 'text does not contain', NOT(sm(tf, 'Contains', 'BC')), { [tf]: 'XYZ' }, { [tf]: 'ABCD' }],
 ['T5', 'text starts with', sm(tf, 'StartsWith', 'AB'), { [tf]: 'ABX' }, { [tf]: 'XAB' }],
 ['T6', 'text ends with', sm(tf, 'EndsWith', 'YZ'), { [tf]: 'XYZ' }, { [tf]: 'YZX' }],
 ['T7', 'text is one of', mem(tf, null, ['ABC', 'DEF']), { [tf]: 'DEF' }, { [tf]: 'XYZ' }],
 ['T8', 'text is not one of', { ...mem(tf, null, ['ABC', 'DEF']), negate: true }, { [tf]: 'XYZ' }, { [tf]: 'ABC' }],
 ['T9', 'text is empty', ex(tf, 'IsNull'), {}, { [tf]: 'ABC' }],
 ['T10', 'text is not empty', ex(tf, 'IsNotNull'), { [tf]: 'ABC' }, {}],
 ['T11', 'text changed', changed(tf), {}, {}, { M: { [tf]: 'NEW' }, N: { priority: 'high' } }],
 ['N1', 'number =', cmp(nf, 'Equal', I(5)), { [nf]: 5 }, { [nf]: 6 }],
 ['N2', 'number ≠', cmp(nf, 'NotEqual', I(5)), { [nf]: 6 }, { [nf]: 5 }],
 ['N3', 'number >', cmp(nf, 'GreaterThan', I(5)), { [nf]: 6 }, { [nf]: 5 }],
 ['N4', 'number ≥ (bound)', cmp(nf, 'GreaterThanOrEqual', I(5)), { [nf]: 5 }, { [nf]: 4 }],
 ['N5', 'number <', cmp(nf, 'LessThan', I(5)), { [nf]: 4 }, { [nf]: 5 }],
 ['N6', 'number ≤ (bound)', cmp(nf, 'LessThanOrEqual', I(5)), { [nf]: 5 }, { [nf]: 6 }],
 ['N7', 'number between 3..5 (upper bound)', btw(nf, I(3), I(5)), { [nf]: 5 }, { [nf]: 6 }],
 ['N8', 'number not between 3..5', nbtw(nf, I(3), I(5)), { [nf]: 6 }, { [nf]: 4 }],
 ['N9', 'number is empty', ex(nf, 'IsNull'), {}, { [nf]: 5 }],
 ['N10', 'number is not empty', ex(nf, 'IsNotNull'), { [nf]: 5 }, {}],
 ['N11', 'number changed', changed(nf), {}, {}, { M: { [nf]: 9 }, N: { priority: 'high' } }],
 ['B1', 'checkbox is True', cmp(cb, 'Equal', B(true)), { [cb]: true }, { [cb]: false }],
 ['B2', 'checkbox is False', cmp(cb, 'Equal', B(false)), { [cb]: false }, { [cb]: true }],
 ['B3', 'checkbox is empty', ex(cb, 'IsNull'), {}, { [cb]: true }],
 ['B4', 'checkbox is not empty', ex(cb, 'IsNotNull'), { [cb]: true }, {}],
 ['B5', 'checkbox changed', changed(cb), {}, {}, { M: { [cb]: true }, N: { priority: 'high' } }],
 ['D1', 'date on', cmp(df, 'Equal', D('2026-12-10')), { [df]: '2026-12-10' }, { [df]: '2026-12-11' }],
 ['D2', 'date after', cmp(df, 'GreaterThan', D('2026-12-10')), { [df]: '2026-12-11' }, { [df]: '2026-12-10' }],
 ['D3', 'date on or after', cmp(df, 'GreaterThanOrEqual', D('2026-12-10')), { [df]: '2026-12-10' }, { [df]: '2026-12-09' }],
 ['D4', 'date before', cmp(df, 'LessThan', D('2026-12-10')), { [df]: '2026-12-09' }, { [df]: '2026-12-10' }],
 ['D5', 'date on or before', cmp(df, 'LessThanOrEqual', D('2026-12-10')), { [df]: '2026-12-10' }, { [df]: '2026-12-11' }],
 ['D6', 'date between 05..10', btw(df, D('2026-12-05'), D('2026-12-10')), { [df]: '2026-12-05' }, { [df]: '2026-12-11' }],
 ['D7', 'date not between 05..10', nbtw(df, D('2026-12-05'), D('2026-12-10')), { [df]: '2026-12-11' }, { [df]: '2026-12-07' }],
 ['D8', 'date is empty', ex(df, 'IsNull'), {}, { [df]: '2026-12-10' }],
 ['D9', 'date is not empty', ex(df, 'IsNotNull'), { [df]: '2026-12-10' }, {}],
 ['D10', 'date changed', changed(df), {}, {}, { M: { [df]: '2026-12-12' }, N: { priority: 'high' } }],
 ['DT1', 'date-time on (same instant)', cmp(dt, 'Equal', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00Z' }, { [dt]: '2026-12-11T10:00:00Z' }],
 ['DT2', 'date-time after', cmp(dt, 'GreaterThan', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T11:00:00Z' }, { [dt]: '2026-12-10T09:00:00Z' }],
 ['DT3', 'date-time on or after', cmp(dt, 'GreaterThanOrEqual', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00Z' }, { [dt]: '2026-12-10T09:59:00Z' }],
 ['DT4', 'date-time before', cmp(dt, 'LessThan', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T09:00:00Z' }, { [dt]: '2026-12-10T11:00:00Z' }],
 ['DT5', 'date-time on or before', cmp(dt, 'LessThanOrEqual', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00Z' }, { [dt]: '2026-12-10T10:01:00Z' }],
 ['DT6', 'date-time between', btw(dt, DTV('2026-12-10T08:00:00'), DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T09:00:00Z' }, { [dt]: '2026-12-10T11:00:00Z' }],
 ['DT7', 'date-time not between', nbtw(dt, DTV('2026-12-10T08:00:00'), DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T11:00:00Z' }, { [dt]: '2026-12-10T09:00:00Z' }],
 ['DT8', 'date-time is empty', ex(dt, 'IsNull'), {}, { [dt]: '2026-12-10T10:00:00Z' }],
 ['DT9', 'date-time is not empty', ex(dt, 'IsNotNull'), { [dt]: '2026-12-10T10:00:00Z' }, {}],
 ['DT10', 'date-time changed', changed(dt), {}, {}, { M: { [dt]: '2026-12-12T10:00:00Z' }, N: { priority: 'high' } }],
 ['DT11', 'date-time after Current Time', cmp(dt, 'GreaterThan', { kind: 'now' }), { [dt]: '2026-12-30T10:00:00Z' }, { [dt]: '2026-01-01T10:00:00Z' }],
 ['DT12', 'date-time before Current Time', cmp(dt, 'LessThan', { kind: 'now' }), { [dt]: '2026-01-01T10:00:00Z' }, { [dt]: '2026-12-30T10:00:00Z' }],
 ['P1', 'picklist is', cmp('priority', 'Equal', S('high')), { priority: 'high' }, { priority: 'low' }],
 ['P2', 'picklist is not', cmp('priority', 'NotEqual', S('high')), { priority: 'low' }, { priority: 'high' }],
 ['P3', 'picklist is one of', mem('priority', null, ['high', 'urgent']), { priority: 'urgent' }, { priority: 'low' }],
 ['P4', 'picklist is not one of', { ...mem('priority', null, ['high', 'urgent']), negate: true }, { priority: 'low' }, { priority: 'high' }],
 ['P5', 'picklist is empty', ex('classification', 'IsNull'), {}, { classification: 'question' }],
 ['P6', 'picklist is not empty', ex('classification', 'IsNotNull'), { classification: 'question' }, {}],
 ['P7', 'picklist changed', changed('priority'), {}, {}, { M: { priority: 'urgent' }, N: { classification: 'feature' } }],
 ['O1', 'department is', cmp('department', 'Equal', S(DEPT)), {}, { department: DEPT2 }],
 ['O2', 'department is not', cmp('department', 'NotEqual', S(DEPT)), { department: DEPT2 }, {}],
 ['O3', 'department is one of', mem('department', null, [DEPT2]), { department: DEPT2 }, {}],
 ['O4', 'department is not one of', { ...mem('department', null, [DEPT2]), negate: true }, {}, { department: DEPT2 }],
 ['O5', 'department is not empty', ex('department', 'IsNotNull'), {}, null],
];
const st = [];
for (const [id, label, crit, M, N, edit] of C) {
  const tag = 'CO' + id; const r = await mkRule(tag, { kind: edit ? 'RecordUpdated' : 'RecordCreated' }, [mark], { criteria: crit });
  st.push({ id, label, tag, r, M, N, edit });
}
for (const x of st) { if (!x.r.id) continue; x.tm = await mkTicket(x.tag, x.M, 'M'); if (x.N) x.tn = await mkTicket(x.tag, x.N, 'N'); }
await sleep(8000);
for (const x of st) if (x.edit && x.r.id) { await patchTicket(x.tm.id, x.edit.M); await patchTicket(x.tn.id, x.edit.N); }
await sleep(45000);
const out = [];
for (const x of st) {
  if (!x.r.id) { out.push({ id: x.id, label: x.label, verdict: 'SAVE-FAIL', err: x.r.err }); continue; }
  const m = x.tm.id ? await fired(x.tm.id, x.r.id) : 'tkt ' + x.tm.err; const n = x.tn ? (x.tn.id ? await fired(x.tn.id, x.r.id) : 'tkt ' + x.tn.err) : '-';
  out.push({ id: x.id, label: x.label, M: m, N: n, verdict: m === 1 && (n === 0 || n === '-') ? 'PASS' : 'CHECK' });
}
fs.writeFileSync(RUN + '/out/co1.json', JSON.stringify(out, null, 1));
return out.filter(o => o.verdict !== 'PASS').concat([{ pass: out.filter(o => o.verdict === 'PASS').length, total: out.length }]);
