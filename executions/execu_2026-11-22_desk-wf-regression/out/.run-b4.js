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
// Batch 4 (run 2): Customer Happiness — TE-07 rating events, CF-12 rating conditions, AC-23 Send happiness email on open/closed, AC-05 closing side effects, E2E-03.
// Happiness is switched ON scoped to QA AO Dept B only, and restored to the saved original at the end (diff checked).
const out = {}; const R = {}; const TK = {};
const ev = (events, extra) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(extra || {}) } });
const mark = v => FU({ qa_ndc_company_name: v });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions, o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const orig = (await api('GET', '/desk/happiness/settings')).j?.data;
if (!orig) return { err: 'no settings' };
fs.writeFileSync(RUN + '/out/happiness-orig.json', JSON.stringify(orig, null, 1)); ledger('happiness settings saved to out/happiness-orig.json (restore at end)');
const strip = o => { const c = { ...o }; for (const k of ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured']) delete c[k]; return c; };
const on = await api('PUT', '/desk/happiness/settings', { ...strip(orig), is_enabled: true, department_scope_enabled: true, department_ids: [DEPT2] });
out.enable = on.s + ' ' + (on.s >= 300 ? on.t.slice(0, 300) : '');
try {
  const hk = await hook();
  // TE-07 rating rules
  await rule('TE07any', ev(['rating']), [WH(hk, '{"r":"any","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07good', ev(['rating'], { ratings: ['good'] }), [WH(hk, '{"r":"good","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07okay', ev(['rating'], { ratings: ['okay'] }), [WH(hk, '{"r":"okay","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07bad', ev(['rating'], { ratings: ['bad'] }), [WH(hk, '{"r":"bad","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  await rule('TE07gb', ev(['rating'], { ratings: ['good', 'bad'] }), [WH(hk, '{"r":"good+bad","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TE07') });
  // CF-12 conditions on rating + link status (On Edit)
  await rule('CF12r', { kind: 'RecordUpdated' }, [mark('RATED-BAD')], { noGuard: true, criteria: AND(guard('QA WF TE07'), cmp('happiness_rating', 'Equal', S('bad'))) });
  await rule('CF12l', { kind: 'RecordUpdated' }, [mark('LINK')], { noGuard: true, criteria: AND(guard('QA WF TE07'), ex('happiness_link_status', 'IsNotNull')) });
  // AC-23 Send happiness email on open + closed
  await rule('AC23', { kind: 'RecordCreated' }, [{ type: 'SendHappinessEmail' }]);
  // E2E-03: closed → Bad rating → share to QA RT19 + task
  await rule('E2E03', ev(['rating'], { ratings: ['bad'] }), [{ type: 'ShareTicket', shareDepartmentId: DEPT, shareAccess: 'read_only' }, { type: 'Task', taskTitle: 'QA WF E2E03 call back ${subject}' }], { noGuard: true, criteria: guard('QA WF E2E03') });
  await sleep(2000);
  const rates = { g: 'good', o: 'okay', b: 'bad' };
  for (const k of Object.keys(rates)) await tk('TE07' + k, 'TE07', {}, rates[k]);
  await tk('AC23o', 'AC23', {}, 'open'); await tk('AC23c', 'AC23', { status: 'Closed' }, 'closed');
  await tk('E2E03', 'E2E03', { priority: 'high' });
  await sleep(8000);
  // close and rate through the public link (acts as the customer)
  const rateOne = async (id, rating) => {
    const cl = await patchTicket(id, { status: 'Closed' }); await sleep(4000);
    const ln = await api('POST', `/desk/tickets/${id}/happiness-link`, {}); const url = ln.j?.data?.url || ln.j?.data?.link || ''; const tokn = ln.j?.data?.token || (url.match(/happiness\/([^/?#]+)/) || [])[1];
    if (!tokn) return { close: cl.s, link: ln.s + ' ' + ln.t.slice(0, 200) };
    const base = 'https://staging-desk.taviportal.com/api/v1/desk/public/happiness/' + encodeURIComponent(tokn);
    const g = await fetch(base, { headers: { accept: 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'x-app-key': 'desk' } }); const gt = await g.text();
    const p = await fetch(base, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'x-app-key': 'desk' }, body: JSON.stringify({ rating, feedback: 'QA WF ' + rating, email: null }) }); const pt = await p.text();
    return { close: cl.s, link: ln.s, view: g.status + ' ' + gt.slice(0, 160), post: p.status + ' ' + pt.slice(0, 200) };
  };
  out.rate = {}; for (const k of Object.keys(rates)) out.rate[k] = await rateOne(TK['TE07' + k], rates[k]);
  out.rate.e2e = await rateOne(TK.E2E03, 'bad');
  await sleep(40000);
  const reqs = await hookReqs(hk); out.hooks = reqs.map(x => x.content);
  const v = {};
  for (const k of Object.keys(rates)) { const g = await getTicket(TK['TE07' + k]); v['TE07' + k] = { rating: g.happiness_rating, link: g.happiness_link_status, company: g.qa_ndc_company_name }; }
  v.AC23 = { open: await disp('AC23o', 'AC23'), closed: await disp('AC23c', 'AC23') };
  const mails = await api('GET', `/desk/tickets/${TK.AC23o}/threads`); v.AC23threads = mails.s + ' ' + JSON.stringify(arr(mails.j?.data).map(t => (t.subject || '') + ' ' + (t.status || t.delivery_status || '') + ' ' + (t.direction || ''))).slice(0, 400);
  { const g = await getTicket(TK.E2E03); v.E2E03 = { shared: g.shared_departments, run: await disp('E2E03', 'E2E03'), rating: g.happiness_rating }; }
  v.ratingsApi = (await api('GET', `/desk/tickets/${TK.TE07b}/happiness-ratings`)).t.slice(0, 300);
  out.v = v;
} finally {
  const cur = (await api('GET', '/desk/happiness/settings')).j?.data;
  const back = await api('PUT', '/desk/happiness/settings', { ...strip(orig), row_version: cur && cur.row_version });
  const now = (await api('GET', '/desk/happiness/settings')).j?.data; const diff = Object.keys(orig).filter(k => !['row_version', 'updated_at'].includes(k) && JSON.stringify(orig[k]) !== JSON.stringify(now && now[k]));
  out.restore = back.s + ' diff=' + JSON.stringify(diff); ledger('happiness restored ' + out.restore);
}
out.R = R; out.TK = TK;
fs.writeFileSync(RUN + '/out/b4.json', JSON.stringify(out, null, 1));
return out;
