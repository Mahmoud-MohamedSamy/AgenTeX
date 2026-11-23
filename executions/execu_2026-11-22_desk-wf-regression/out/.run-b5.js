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
// Batch 5 (run 2): business hours — TD-06, TD-07, CF-10 (+TC-08 outside). Tenant hours are 24/7; switched to custom 01:00-23:00 Cairo
// for a few minutes (now ~23:15 Cairo = closed) and a QA holiday list for today linked to the default profile; both restored at the end.
const out = {}; const R = {}; const TK = {};
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' };
const DT = (sec, mode) => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: sec, offsetMode: mode || 'wall_clock' });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const at = s => new Date(Date.now() + s * 1000).toISOString();
const ex1 = async (k, r) => (await execs(TK[k], R[r])).map(e => outcome(e) + (e.scheduledFor || e.scheduledAt || e.runAt || e.dueAt ? '@' + (e.scheduledFor || e.scheduledAt || e.runAt || e.dueAt) : ''));
const orig = (await api('GET', '/desk/business-hours')).j?.data; fs.writeFileSync(RUN + '/out/bh-orig.json', JSON.stringify(orig, null, 1));
ledger('business hours saved out/bh-orig.json preset=' + orig.preset);
// rules
await rule('TD06b', DT(-60, 'business_hours')); await rule('TD06w', DT(-60));
await rule('TD06days', DT(-86400, 'business_hours'));
await rule('CF10in', CR, [mark], { criteria: cmp('executionTime', 'Equal', S('business_hours')) });
await rule('CF10out', CR, [mark], { criteria: cmp('executionTime', 'Equal', S('outside_business_hours')) });
await rule('CF10hol', CR, [mark], { criteria: cmp('executionTime', 'Equal', S('holiday')) });
out.TD06days = R.TD06days ? 'saved (days in business mode accepted by API)' : out['TD06days save'];
// phase 1: 24/7 (= TD-07 "no business hours": counting falls back to wall clock)
await tk('TD07b', 'TD06b', { due_date: at(150) }, 'p1'); await tk('TD07w', 'TD06w', { due_date: at(150) }, 'p1');
await tk('CF10a', 'CF10in', {}, 'p1'); await tk('CF10b', 'CF10out', {}, 'p1'); await tk('CF10c', 'CF10hol', {}, 'p1');
await sleep(20000);
out.p1 = { in: await fired(TK.CF10a, R.CF10in), out: await fired(TK.CF10b, R.CF10out), hol: await fired(TK.CF10c, R.CF10hol) };
// phase 2: custom 01:00-23:00 (closed now)
const set = await api('PUT', '/iam/tenant/business-hours', { preset: 'custom', days_active: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], timing_mode: 'same', hours: { open: '01:00', close: '23:00' }, hours_per_day: null, week_starts_on: orig.week_starts_on || 'mon', time_zone: orig.time_zone || 'Africa/Cairo' });
out.set = set.s + ' ' + (set.s >= 300 ? set.t.slice(0, 200) : ''); ledger('business hours set custom 01:00-23:00 ' + set.s);
try {
  const now = (await api('GET', '/desk/business-hours')).j?.data; out.nowOpen = now && now.is_open_now + ' next ' + now.next_opens_at;
  await tk('TD06b', 'TD06b', { due_date: at(150) }, 'p2'); await tk('TD06w', 'TD06w', { due_date: at(150) }, 'p2');
  await tk('CF10d', 'CF10in', {}, 'p2'); await tk('CF10e', 'CF10out', {}, 'p2');
  await sleep(20000);
  out.p2 = { in: await fired(TK.CF10d, R.CF10in), out: await fired(TK.CF10e, R.CF10out), pendB: await ex1('TD06b', 'TD06b'), pendW: await ex1('TD06w', 'TD06w') };
  // holiday today on the default profile (back to 24/7 first so only the holiday decides)
  await api('PUT', '/iam/tenant/business-hours', { preset: '24_7', days_active: orig.days_active, timing_mode: null, hours: null, hours_per_day: null, week_starts_on: orig.week_starts_on, time_zone: orig.time_zone });
  const today = new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 10);
  const prof = arr((await api('GET', '/iam/tenant/business-hours/profiles')).j?.data).find(p => p.is_default);
  const hl = await api('POST', '/desk/holiday-lists', { name: 'QA WF HOL today', description: null, is_active: true, category: 'year_specific', business_hour_profile_id: prof && prof.id, detached: false, holidays: [{ name: 'QA WF today', start_date: today, end_date: null, occurrence: 'year_specific' }] });
  const HL = hl.j?.data?.id || hl.j?.data?.list?.id; out.hol = hl.s + ' ' + (HL || hl.t.slice(0, 250)); if (HL) ledger(`holiday list "QA WF HOL today" ${HL} (linked to default profile)`);
  if (HL) { await tk('CF10f', 'CF10hol', {}, 'p3'); await tk('CF10g', 'CF10in', {}, 'p3'); await sleep(20000); out.p3 = { hol: await fired(TK.CF10f, R.CF10hol), in: await fired(TK.CF10g, R.CF10in) }; const d = await api('DELETE', '/desk/holiday-lists/' + HL); out.holDel = d.s; ledger('holiday list deleted ' + d.s); }
} finally {
  const back = await api('PUT', '/iam/tenant/business-hours', { preset: orig.preset, days_active: orig.days_active, timing_mode: orig.timing_mode, hours: orig.hours, hours_per_day: orig.hours_per_day, week_starts_on: orig.week_starts_on, time_zone: orig.time_zone, ...(orig.slots ? { slots: orig.slots } : {}) });
  const fin = (await api('GET', '/desk/business-hours')).j?.data; out.restored = back.s + ' → ' + fin.preset + ' ' + JSON.stringify(fin.hours); ledger('business hours restored ' + out.restored);
}
await sleep(120000);
out.final = { p1b: await fired(TK.TD07b, R.TD06b), p1w: await fired(TK.TD07w, R.TD06w), p2b: await ex1('TD06b', 'TD06b'), p2w: await fired(TK.TD06w, R.TD06w) };
out.R = R; out.TK = TK;
fs.writeFileSync(RUN + '/out/b5.json', JSON.stringify(out, null, 1));
return out;
