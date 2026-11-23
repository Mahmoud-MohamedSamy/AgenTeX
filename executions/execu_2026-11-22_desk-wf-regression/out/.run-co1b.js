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
 ['DT1', 'date-time on (same instant)', cmp(dt, 'Equal', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00+02:00' }, { [dt]: '2026-12-11T10:00:00+02:00' }],
 ['DT2', 'date-time after', cmp(dt, 'GreaterThan', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T11:00:00+02:00' }, { [dt]: '2026-12-10T09:00:00+02:00' }],
 ['DT3', 'date-time on or after', cmp(dt, 'GreaterThanOrEqual', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00+02:00' }, { [dt]: '2026-12-10T09:59:00+02:00' }],
 ['DT4', 'date-time before', cmp(dt, 'LessThan', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T09:00:00+02:00' }, { [dt]: '2026-12-10T11:00:00+02:00' }],
 ['DT5', 'date-time on or before', cmp(dt, 'LessThanOrEqual', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00+02:00' }, { [dt]: '2026-12-10T10:01:00+02:00' }],
 ['DT6', 'date-time between', btw(dt, DTV('2026-12-10T08:00:00'), DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T09:00:00+02:00' }, { [dt]: '2026-12-10T11:00:00+02:00' }],
 ['DT7', 'date-time not between', nbtw(dt, DTV('2026-12-10T08:00:00'), DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T11:00:00+02:00' }, { [dt]: '2026-12-10T09:00:00+02:00' }],
];
const st = [];
for (const [id, label, crit, M, N, edit] of C) {
  const tag = 'CO' + id + 'b'; const r = await mkRule(tag, { kind: edit ? 'RecordUpdated' : 'RecordCreated' }, [mark], { criteria: crit });
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
fs.writeFileSync(RUN + '/out/co1b.json', JSON.stringify(out, null, 1));
return out.filter(o => o.verdict !== 'PASS').concat([{ pass: out.filter(o => o.verdict === 'PASS').length, total: out.length }]);
