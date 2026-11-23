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
// Re-verify findings still reproduce today (23 Nov) before the review report. Tag prefix RV. Dept B, guarded rules.
const out = {}; const R = {}; const TK = {};
for (const r of (await allRules()).filter(r => /^QA WF RV/.test(r.name))) await api('DELETE', '/workflow/rules/' + r.id);
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], { departmentIds: [DEPT2], ...o }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + (r.err || '').slice(0, 200); return r; };
const tk = async (k, tag, vals, suf) => { TK[k] = (await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf)).id; return TK[k]; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 110) + ')' : '')).join(','));
const at = s => new Date(Date.now() + s * 1000).toISOString();
// saves only (API validation findings)
const sv = async (k, trig, actions, crit, active) => { const r = await rule(k, trig, actions, { criteria: crit, active: !!active }); return r.s + (r.id ? ' SAVED' : ' ' + (r.err || '').slice(0, 160)); };
out.MX04 = await sv('RVMX04', { kind: 'RecordDeleted' }, [{ type: 'SendHappinessEmail' }]);
out.CO90 = await sv('RVCO90', CR, [mark], { kind: 'Between', field: 'due_date', low: TS(at(10 * 86400)), high: TS(at(86400)) });
out.CO90alt = await sv('RVCO90b', CR, [mark], AND(cmp('due_date', 'GreaterThanOrEqual', TS(at(10 * 86400))), cmp('due_date', 'LessThanOrEqual', TS(at(86400)))));
// API-01: inactive rule, PATCH with only actions
{ await rule('RVAPI01', CR, [mark], { criteria: sm('subject', 'StartsWith', 'QA WF RVAPI01 '), noGuard: true, active: false }); const p = await api('PATCH', '/workflow/rules/' + R.RVAPI01, { actions: [{ order: 0, delaySeconds: 0, ...FU({ qa_ndc_agency_code: 'X' }) }] }); const g = (await allRules()).find(x => x.id === R.RVAPI01); out.API01 = p.s + ' criteria after: ' + JSON.stringify(g && g.criteria).slice(0, 80) + ' active ' + (g && g.isActive); }
// CO-92: tag deleted while used
{ const tg = await api('POST', '/desk/tags', { name: 'zz wf rv92', department_id: DEPT2 }); const tid = tg.j?.data?.id; if (tid) ledger(`tag "zz wf rv92" ${tid}`); await rule('RVCO92', CR, [mark], { criteria: mem('tags', 'In', [tid]) }); const d = await api('DELETE', '/desk/tags/' + tid + '?confirm=true'); const g = (await allRules()).find(x => x.id === R.RVCO92); out.CO92 = 'tag delete ' + d.s + '; rule active ' + (g && g.isActive) + '; save ' + (out["RVCO92 save"] || 'ok') + '; tag id ' + tid + '; criteria ' + String(JSON.stringify(g && g.criteria)).slice(0, 160); }
// runtime ones
await rule('RVCO86cs', CR, [mark], { criteria: sm('subject', 'Contains', 'co86 lower', false) });
await rule('RVCO86eq', CR, [mark], { criteria: cmp('qa_ndc_ticket', 'Equal', S('abc')) });
await rule('RVCF11', CR, [mark], { criteria: cmp('sla_violated', 'Equal', B(false)) });
await rule('RVAC25', CR, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('QA WF x') } }]);
await rule('RVAT03', CR, [{ type: 'AddTicketComment', commentBody: 'S=${subject} P=${priority} N=${ticket_number} END', commentPublic: false }]);
await rule('RVAC03', CR, [FU({ classification: 'Problem' })]);
await rule('RVTR06', UP, [mark]);
await rule('RVMR07', CR, [{ ...FU({ qa_ndc_company_name: 'MR07-v1' }), delaySeconds: 60 }]);
await rule('RVTD11', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: 60, offsetMode: 'wall_clock' }, [mark]);
await sleep(3000);
await tk('CO86', 'RVCO86cs', {}, 'CO86 LOWER'); await tk('CO86eq', 'RVCO86eq', { qa_ndc_ticket: 'ABC' }); await tk('CF11', 'RVCF11'); await tk('AC25', 'RVAC25', { email: undefined }); await tk('AT03', 'RVAT03'); await tk('AC03', 'RVAC03');
await tk('TR06', 'RVTR06', { priority: 'high' }); await tk('MR07', 'RVMR07'); await tk('TD11', 'RVTD11', { due_date: at(-1800) });
await sleep(20000);
const tr0 = (await execs(TK.TR06, R.RVTR06)).length; await patchTicket(TK.TR06, { priority: 'high' }); 
// MR-07: edit rule while pending (full body PATCH)
{ const g = (await allRules()).find(x => x.id === R.RVMR07); const body = { moduleId: T, name: g.name, description: g.description, isActive: g.isActive, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: [{ order: 0, delaySeconds: 60, ...FU({ qa_ndc_company_name: 'MR07-v2' }) }], departmentIds: g.departmentIds, version: g.version }; out.MR07patch = (await api('PATCH', '/workflow/rules/' + R.RVMR07, body)).s; }
await sleep(120000);
const g = async k => getTicket(TK[k]);
out.v = {
  CO86_containsCaseSensitive: await disp('CO86', 'RVCO86cs'), CO86_equalsABCvsabc: await disp('CO86eq', 'RVCO86eq'),
  CF11_slaViolatedFalse: { val: (await g('CF11')).sla_violated ?? null, runs: await disp('CF11', 'RVCF11') },
  AC25_noContact: { contact: (await g('AC25')).contact_id ?? null, runs: await disp('AC25', 'RVAC25') },
  AT03: { runs: await disp('AT03', 'RVAT03'), comment: ((await api('GET', `/desk/tickets/${TK.AT03}/comments`)).t.match(/S=[^<"]{0,80}END/) || [''])[0], ticketNumber: (await g('AT03')).ticket_number },
  AC03: { stored: (await g('AC03')).classification, runs: await disp('AC03', 'RVAC03') },
  TR06_samePriority: { before: tr0, after: (await execs(TK.TR06, R.RVTR06)).length },
  MR07: { value: (await g('MR07')).qa_ndc_company_name ?? null, runs: await disp('MR07', 'RVMR07') },
  TD11_pastDue: await disp('TD11', 'RVTD11'),
};
fs.writeFileSync(RUN + '/out/rv1.json', JSON.stringify({ R, TK, out }, null, 1)); return out;
