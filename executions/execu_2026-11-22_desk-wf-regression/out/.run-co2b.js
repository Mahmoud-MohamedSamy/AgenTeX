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
// Reruns: U7 owner changed (via Desk assign), O7 department changed (via move), R2 account related field; remove auto-tag noise first.
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const mark = FU({ qa_ndc_company_name: 'WFHIT' });
const out = {};
for (const id of ['a41004d3-79e9-42bb-acd5-ad7fb363389b', '0fc9d573-2de6-4fc1-8400-ab8cb5092b2d']) out['deltag ' + id.slice(0, 8)] = (await api('DELETE', '/desk/tags/' + id)).s;
ledger('deleted tags QA WF tagA/tagB (auto-tag noise)');
const acc = await api('POST', `/modules/${AM}/records`, { data: [{ field: 'name', value: enc('QA WF Account') }, { field: 'account_name', value: enc('QA WF Account') }, { field: 'country', value: enc('Egypt') }] });
const accId = acc.j && acc.j.data && acc.j.data.id; if (accId) ledger('account "QA WF Account" ' + accId); out.acc = acc.s + ' ' + (errOf(acc) || '');
const rU = await mkRule('COU7b', { kind: 'RecordUpdated' }, [mark], { criteria: changed('owner') });
const rFC = await mkRule('COU7fc', { kind: 'SpecificFieldChanged', fieldName: 'owner', fieldNames: ['owner'], fieldMatch: 'any', alsoOnCreate: false }, [mark]);
const rO = await mkRule('COO7b', { kind: 'RecordUpdated' }, [mark], { criteria: changed('department') });
const rE = await mkRule('COO7e', { kind: 'RecordUpdated' }, [mark]);
const rR = accId ? await mkRule('COR2b', { kind: 'RecordCreated' }, [mark], { criteria: cmp('account_id.country', 'Equal', S('Egypt')) }) : { id: null };
const tU = await mkTicket('COU7b', { department: DEPT2, owner: TU1 }); const tF = await mkTicket('COU7fc', { department: DEPT2, owner: TU1 });
const tO = await mkTicket('COO7b', { department: DEPT2 }); const tE = await mkTicket('COO7e', { department: DEPT2 });
const tRm = rR.id ? await mkTicket('COR2b', { department: DEPT2, account_id: accId }, 'M') : {}; const tRn = rR.id ? await mkTicket('COR2b', { department: DEPT2 }, 'N') : {};
await sleep(15000);
const base = { u: await fired(tU.id, rU.id), f: await fired(tF.id, rFC.id), o: await fired(tO.id, rO.id), e: await fired(tE.id, rE.id) };
const a1 = await api('POST', `/desk/tickets/${tU.id}/assign`, { owner_id: DEV2 }); const a2 = await api('POST', `/desk/tickets/${tF.id}/assign`, { owner_id: DEV2 });
const m1 = await api('POST', `/desk/tickets/${tO.id}/move`, { department_id: DEPT }); const m2 = await api('POST', `/desk/tickets/${tE.id}/move`, { department_id: DEPT });
await sleep(35000);
out.base = base;
out.U7 = { assign: a1.s + ' ' + (errOf(a1) || ''), ownerNow: (await getTicket(tU.id)).owner === DEV2, changedOwnerFired: await fired(tU.id, rU.id) };
out.U7fc = { assign: a2.s, fieldChangedOwnerFired: await fired(tF.id, rFC.id) };
out.O7 = { move: m1.s + ' ' + (errOf(m1) || ''), deptNow: (await getTicket(tO.id)).department === DEPT, changedDeptFired: await fired(tO.id, rO.id) };
out.moveAnyEdit = { move: m2.s, onEditFired: await fired(tE.id, rE.id) };
if (rR.id) out.R2 = { M: await fired(tRm.id, rR.id), N: await fired(tRn.id, rR.id) };
return out;
