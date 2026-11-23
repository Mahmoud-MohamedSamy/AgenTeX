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
const TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const mark = FU({ qa_ndc_company_name: 'WFHIT' }); const out = {};
const CEt = { kind: 'RecordCreatedOrUpdated' };
// mode
const rRec = await mkRule('RMrec', CEt, [mark]); const rOne = await mkRule('RMone', CEt, [mark], { mode: 'OneTime' });
// active / inactive
const rOff = await mkRule('RMoff', { kind: 'RecordCreated' }, [mark], { active: false });
// layout scope
const rLay = await mkRule('RMlay', { kind: 'RecordCreated' }, [mark], { layoutId: TLR });
// department scope
const rD1 = await mkRule('RMd1', { kind: 'RecordCreated' }, [mark], { departmentIds: [DEPT] });
const rDall = await mkRule('RMdall', { kind: 'RecordCreated' }, [mark], { departmentIds: [] });
// logic: (A and B) or C ; A=priority high, B=classification problem, C=agent_id 7
const A = cmp('priority', 'Equal', S('high')), Bc = cmp('classification', 'Equal', S('problem')), Cc = cmp('qa_ndc_agent_id', 'Equal', I(7));
const rLog = await mkRule('RMlog', { kind: 'RecordCreated' }, [mark], { criteria: OR(AND(A, Bc), Cc) });
const rLog2 = await mkRule('RMlog2', { kind: 'RecordCreated' }, [mark], { criteria: AND(A, OR(Bc, Cc)) });
out.save = Object.fromEntries(Object.entries({ rRec, rOne, rOff, rLay, rD1, rDall, rLog, rLog2 }).map(([k, r]) => [k, r.s + (r.err ? ' ' + r.err.slice(0, 120) : '')]));
// limits
const many = n => Array.from({ length: n }, (_, i) => cmp('qa_ndc_agent_id', 'NotEqual', I(1000 + i)));
const l25 = await mkRule('RMc25', { kind: 'RecordCreated' }, [mark], { criteria: AND(...many(24)), active: false });  // + guard = 25
const l26 = await mkRule('RMc26', { kind: 'RecordCreated' }, [mark], { criteria: AND(...many(25)), active: false });  // + guard = 26
const tenFU = Array.from({ length: 10 }, (_, i) => FU({ ['qa_ndc_company_name']: 'v' + i }));
const a10 = await mkRule('RMa10', { kind: 'RecordCreated' }, tenFU, { active: false });
const a11 = await mkRule('RMa11', { kind: 'RecordCreated' }, [...tenFU, FU({ qa_ndc_agency_code: 'x' })], { active: false });
const dupId = await mkRule('RMdup', { kind: 'RecordCreated' }, [mark, mark], { active: false });
const own2 = await mkRule('RMown2', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }, { type: 'OwnerAssignment', ownerTargetKind: 'UserField', ownerValue: 'created_by' }], { active: false });
const own2s = await mkRule('RMown2s', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }, { type: 'OwnerAssignment', ownerTargetKind: 'UserField', ownerValue: 'created_by', delaySeconds: 3600 }], { active: false });
const fu2 = await mkRule('RMfu2', { kind: 'RecordCreated' }, [FU({ qa_ndc_company_name: 'a' }), FU({ qa_ndc_agency_code: 'b' })], { active: false });
const noAct = await mkRule('RMnoact', { kind: 'RecordCreated' }, [], { active: false });
out.limits = Object.fromEntries(Object.entries({ l25, l26, a10, a11, dupId, own2, own2s, fu2, noAct }).map(([k, r]) => [k, r.s + (r.err ? ' ' + r.err.slice(0, 140) : '')]));
for (const r of [l25, l26, a10, a11, dupId, own2, own2s, fu2, noAct]) if (r.id) await api('DELETE', '/workflow/rules/' + r.id);
// tickets
const tRec = await mkTicket('RMrec', { department: DEPT }); const tOne = await mkTicket('RMone', { department: DEPT }); const tOff = await mkTicket('RMoff', { department: DEPT });
const tLayY = await mkTicket('RMlay', { department: DEPT, _layout: TLR }, 'Y'); const tLayN = await mkTicket('RMlay', { department: DEPT }, 'N');
const tD1y = await mkTicket('RMd1', { department: DEPT }, 'Y'); const tD1n = await mkTicket('RMd1', { department: DEPT2 }, 'N');
const tDa1 = await mkTicket('RMdall', { department: DEPT }, 'A'); const tDa2 = await mkTicket('RMdall', { department: DEPT2 }, 'B');
const truth = [['hp', { priority: 'high', classification: 'problem' }], ['hq', { priority: 'high', classification: 'question' }], ['lq7', { priority: 'low', classification: 'question', qa_ndc_agent_id: 7 }], ['hq7', { priority: 'high', classification: 'question', qa_ndc_agent_id: 7 }], ['lp', { priority: 'low', classification: 'problem' }]];
const tl = {}, tl2 = {}; for (const [k, v] of truth) { tl[k] = await mkTicket('RMlog', { department: DEPT, ...v }, k); tl2[k] = await mkTicket('RMlog2', { department: DEPT, ...v }, k); }
await sleep(10000);
for (let i = 0; i < 3; i++) { await patchTicket(tRec.id, { qa_ndc_agency_code: 'e' + i }); await patchTicket(tOne.id, { qa_ndc_agency_code: 'e' + i }); await sleep(6000); }
await sleep(30000);
out.mode = { recurring_create_plus3edits: await fired(tRec.id, rRec.id), oneTime_create_plus3edits: await fired(tOne.id, rOne.id) };
out.inactive = await fired(tOff.id, rOff.id);
// activate the inactive rule and create again
await api('POST', '/workflow/rules/' + rOff.id + '/activate'); const tOff2 = await mkTicket('RMoff', { department: DEPT }, 'after'); await sleep(25000); out.afterActivate = await fired(tOff2.id, rOff.id);
out.layout = { onLayout: await fired(tLayY.id, rLay.id), otherLayout: await fired(tLayN.id, rLay.id) };
out.dept = { inScope: await fired(tD1y.id, rD1.id), outScope: await fired(tD1n.id, rD1.id), all_A: await fired(tDa1.id, rDall.id), all_B: await fired(tDa2.id, rDall.id) };
out.logic1 = {}; out.logic2 = {}; for (const [k] of truth) { out.logic1[k] = await fired(tl[k].id, rLog.id); out.logic2[k] = await fired(tl2[k].id, rLog2.id); }
fs.writeFileSync(RUN + '/out/rm.json', JSON.stringify(out, null, 1));
return out;
