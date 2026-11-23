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
// CO batch 2: lookup (contact), user (owner), Tags, department changed; CF related fields. Tickets in DEPT2 (has agents).
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const mark = FU({ qa_ndc_company_name: 'WFHIT' });
const mkRec = async (mid, vals, label) => { const r = await api('POST', `/modules/${mid}/records`, { data: Object.entries(vals).map(([field, x]) => ({ field, value: enc(x) })) }); const id = r.j && r.j.data && r.j.data.id; if (id) ledger(`${label} ${id}`); return { id, err: errOf(r) }; };
const acc = await mkRec(AM, { name: 'QA WF Account', account_name: 'QA WF Account', industry: 'Technology' }, 'account "QA WF Account"');
const c1 = await mkRec(CM, { name: 'QA WF Contact One', last_name: 'QA WF Contact One', email: 'mahmoud.mmohamedsamy+qawf1@gmail.com', title: 'Manager', account_id: acc.id }, 'contact "QA WF Contact One"');
const c2 = await mkRec(CM, { name: 'QA WF Contact Two', last_name: 'QA WF Contact Two', email: 'mahmoud.mmohamedsamy+qawf2@gmail.com', title: 'Clerk' }, 'contact "QA WF Contact Two"');
const tagA = await api('POST', '/desk/tags', { department_id: DEPT2, name: 'QA WF tagA' }); const tagB = await api('POST', '/desk/tags', { department_id: DEPT2, name: 'QA WF tagB' });
const TA = tagA.j && tagA.j.data && tagA.j.data.id, TB = tagB.j && tagB.j.data && tagB.j.data.id; ledger(`tags QA WF tagA ${TA} tagB ${TB}`);
const setup = { acc: acc.id || acc.err, c1: c1.id || c1.err, c2: c2.id || c2.err, TA: TA || tagA.t.slice(0, 200), TB };
if (!c1.id || !TA) return { setup };
const d2 = { department: DEPT2 };
const C = [
 ['L1', 'lookup is', cmp('contact_id', 'Equal', S(c1.id)), { contact_id: c1.id }, { contact_id: c2.id }],
 ['L2', 'lookup is not', cmp('contact_id', 'NotEqual', S(c1.id)), { contact_id: c2.id }, { contact_id: c1.id }],
 ['L3', 'lookup is one of', mem('contact_id', null, [c1.id]), { contact_id: c1.id }, { contact_id: c2.id }],
 ['L4', 'lookup is not one of', { ...mem('contact_id', null, [c1.id]), negate: true }, { contact_id: c2.id }, { contact_id: c1.id }],
 ['L5', 'lookup is empty', ex('contact_id', 'IsNull'), {}, { contact_id: c1.id }],
 ['L6', 'lookup is not empty', ex('contact_id', 'IsNotNull'), { contact_id: c1.id }, {}],
 ['L7', 'lookup changed', changed('contact_id'), { contact_id: c1.id }, { contact_id: c1.id }, { M: { contact_id: c2.id }, N: { priority: 'high' } }],
 ['U1', 'user is', cmp('owner', 'Equal', S(TU1)), { owner: TU1 }, { owner: DEV2 }],
 ['U2', 'user is not', cmp('owner', 'NotEqual', S(TU1)), { owner: DEV2 }, { owner: TU1 }],
 ['U3', 'user is one of', mem('owner', null, [TU1, OWN]), { owner: TU1 }, { owner: DEV2 }],
 ['U4', 'user is not one of', { ...mem('owner', null, [TU1]), negate: true }, { owner: DEV2 }, { owner: TU1 }],
 ['U5', 'user is empty', ex('owner', 'IsNull'), {}, { owner: TU1 }],
 ['U6', 'user is not empty', ex('owner', 'IsNotNull'), { owner: TU1 }, {}],
 ['U7', 'user changed', changed('owner'), { owner: TU1 }, { owner: TU1 }, { M: { owner: DEV2 }, N: { priority: 'high' } }],
 ['U8', 'Created By is (value-only system field)', cmp('created_by', 'Equal', S(OWN)), {}, null],
 ['O7', 'department changed', changed('department'), {}, {}, { M: { department: DEPT }, N: { priority: 'high' } }],
 ['R1', 'related contact_id.title equals Manager', cmp('contact_id.title', 'Equal', S('Manager')), { contact_id: c1.id }, { contact_id: c2.id }],
 ['R2', 'related account_id.industry (ticket account)', cmp('account_id.industry', 'Equal', S('Technology')), { account_id: acc.id }, {}],
 ['R3', 'related field when no contact = empty', ex('contact_id.title', 'IsNull'), {}, { contact_id: c1.id }],
];
// Tags (added after create through the tags endpoint, so On Edit rules + a later edit)
const G = [
 ['G1', 'tags contains any of', mem('tags', null, [TA]), [TA], [TB]],
 ['G2', 'tags contains all of', { ...mem('tags', 'All', [TA, TB]) }, [TA, TB], [TA]],
 ['G3', 'tags contains none of', { ...mem('tags', null, [TA]), negate: true }, [TB], [TA]],
 ['G4', 'tags is empty', ex('tags', 'IsNull'), [], [TA]],
 ['G5', 'tags is not empty', ex('tags', 'IsNotNull'), [TA], []],
];
const st = [];
for (const [id, label, crit, M, N, edit] of C) { const r = await mkRule('CO' + id, { kind: edit ? 'RecordUpdated' : 'RecordCreated' }, [mark], { criteria: crit }); st.push({ id, label, r, M, N, edit }); }
for (const [id, label, crit, M, N] of G) { const r = await mkRule('CO' + id, { kind: 'RecordUpdated' }, [mark], { criteria: crit }); st.push({ id, label, r, M, N, tags: true }); }
for (const x of st) {
  if (!x.r.id) continue;
  if (x.tags) { x.tm = await mkTicket('CO' + x.id, d2, 'M'); x.tn = await mkTicket('CO' + x.id, d2, 'N'); continue; }
  x.tm = await mkTicket('CO' + x.id, { ...d2, ...x.M }, 'M'); if (x.N) x.tn = await mkTicket('CO' + x.id, { ...d2, ...x.N }, 'N');
}
await sleep(8000);
for (const x of st) {
  if (!x.r.id) continue;
  if (x.tags) { if (x.M.length) await api('POST', `/desk/tickets/${x.tm.id}/tags`, { tag_ids: x.M }); if (x.N.length) await api('POST', `/desk/tickets/${x.tn.id}/tags`, { tag_ids: x.N }); await sleep(1500); await patchTicket(x.tm.id, { classification: 'others' }); await patchTicket(x.tn.id, { classification: 'others' }); }
  else if (x.edit) { await patchTicket(x.tm.id, x.edit.M); await patchTicket(x.tn.id, x.edit.N); }
}
await sleep(45000);
const out = [];
for (const x of st) {
  if (!x.r.id) { out.push({ id: x.id, label: x.label, verdict: 'SAVE-FAIL', err: x.r.err }); continue; }
  const m = x.tm.id ? await fired(x.tm.id, x.r.id) : 'tkt ' + x.tm.err; const n = x.tn ? (x.tn.id ? await fired(x.tn.id, x.r.id) : 'tkt ' + x.tn.err) : '-';
  const ok = x.tags ? (m >= 1 && n === 0) : (m === 1 && (n === 0 || n === '-'));
  out.push({ id: x.id, label: x.label, M: m, N: n, verdict: ok ? 'PASS' : 'CHECK' });
}
fs.writeFileSync(RUN + '/out/co2.json', JSON.stringify({ setup, out }, null, 1));
return { setup, notPass: out.filter(o => o.verdict !== 'PASS'), pass: out.filter(o => o.verdict === 'PASS').length, total: out.length };
