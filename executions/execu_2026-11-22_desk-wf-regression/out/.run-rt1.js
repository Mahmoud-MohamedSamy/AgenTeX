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
// Retest of the 5 FAIL cases (23 Nov): AC-07, AC-10, TC-01, TC-04, OB-02. Tag prefix RT.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', ORG = '7972984b-b5cc-034a-bd96-6de61e3937d0';
const nm = { [TU1]: 'Test User 1', [DEV2]: 'Dev Team 2', [OWN]: 'owner' };
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const DT = sec => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: sec, offsetMode: 'wall_clock' });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; if (!t.id) out[k + ' tk'] = t.s + ' ' + t.err; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const at = s => new Date(Date.now() + s * 1000).toISOString();
const AR = async (body, name) => { const r = await api('POST', '/desk/assignment-rules', { description: 'QA', execute_on: ['create'], name, ...body }); const id = r.j?.data?.id || r.j?.data?.rule?.id; if (id) ledger(`assignment rule "${name}" ${id}`); out['ar ' + name] = r.s + (id ? '' : ' ' + r.t.slice(0, 200)); return id; };
// pre-checks
out.roleMembers = arr((await api('GET', '/iam/users?take=200')).j?.data).filter(u => u.orgUnitId === ORG).map(u => (u.displayName || u.email || '').slice(0, 30) + ' ' + u.status);
// OB-02
{ const draft = { moduleId: T, name: 'QA WF RTOB draft', mode: 'Recurring', trigger: CR, criteria: cmp('priority', 'Equal', S('high')), actions: [{ order: 0, delaySeconds: 0, ...FU({ qa_ndc_company_name: 'T' }) }], departmentIds: [DEPT2] };
  const e1 = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { priority: S('high') } } });
  const e2 = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { priority: S('low') } } });
  out.OB02 = { match: e1.s + ' ' + e1.t.slice(0, 300), noMatch: e2.s + ' ' + e2.t.slice(0, 200) }; }
// rules
await rule('RTAC07', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'OrgUnitRoundRobin', ownerValue: ORG }]);
await rule('RTTC01', CR, [mark], { criteria: changed('priority') });
await rule('RTTC04', DT(-120), [mark], { criteria: cmp('priority', 'Equal', S('high')) });
const A1 = await AR({ type: 'direct', name: 'QA WF RT direct', is_active: true, targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF RTAC10d' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: TU1, team_id: null } }] }, 'QA WF RT direct');
const A2 = await AR({ type: 'round_robin', department_id: DEPT2, name: 'QA WF RT rr', is_active: true, targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF RTAC10r' }], pattern: '1' }, method: 'sequential', pool: { kind: 'agents', user_ids: [TU1, OWN], team_id: null, excluded_user_ids: [] } }] }, 'QA WF RT rr');
if (A1) await rule('RTAC10d', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: A1 }]);
if (A2) await rule('RTAC10r', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: A2 }]);
await sleep(3000);
// tickets
for (let i = 0; i < 3; i++) { await tk('AC07' + i, 'RTAC07', {}, 'n' + i); await sleep(2000); }
await tk('TC01', 'RTTC01', { priority: 'high' });
await tk('TC04a', 'RTTC04', { priority: 'high', due_date: at(200) }, 'a'); await tk('TC04b', 'RTTC04', { priority: 'high', due_date: at(200) }, 'b'); await tk('TC04c', 'RTTC04', { priority: 'low', due_date: at(200) }, 'c');
if (A1) await tk('AC10d', 'RTAC10d'); if (A2) await tk('AC10r', 'RTAC10r');
await sleep(15000);
await patchTicket(TK.TC04b, { priority: 'low' }); await patchTicket(TK.TC04c, { priority: 'high' });
await sleep(30000);
const v = {};
v.AC07 = []; for (let i = 0; i < 3; i++) { const o = (await getTicket(TK['AC07' + i])).owner; v.AC07.push((nm[o] || o || 'none') + ' | ' + (await disp('AC07' + i, 'RTAC07')).join(' ')); }
v.TC01 = await disp('TC01', 'RTTC01');
for (const k of ['AC10d', 'AC10r']) if (TK[k]) { const g = await getTicket(TK[k]); v[k] = { owner: nm[g.owner] || g.owner || 'none', run: await disp(k, 'RT' + k) }; }
await sleep(230000); // TC-04 fire ~80 s after create + margin
v.TC04 = {}; for (const k of ['TC04a', 'TC04b', 'TC04c']) v.TC04[k] = { prio: (await getTicket(TK[k])).priority, mark: (await getTicket(TK[k])).qa_ndc_agency_code || '-', run: await disp(k, 'RTTC04') };
out.v = v; out.R = R; out.TK = TK; out.AR = { A1, A2 };
fs.writeFileSync(RUN + '/out/rt1.json', JSON.stringify(out, null, 1));
return out;
