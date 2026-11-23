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
  const v = { subject: `QA WF ${tag} ${suffix}`.trim(), status: 'Open', department: DEPT, email: QA_EMAIL, channel: 'Web', priority: 'medium', ...vals };
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
async function hook() { const r = await fetch('https://webhook.site/token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: '{}' }); const j = await r.json(); return { url: 'https://webhook.site/' + j.uuid, uuid: j.uuid }; }
async function hookReqs(h) { try { const r = await fetch(`https://webhook.site/token/${h.uuid}/requests?sorting=oldest&per_page=50`, { headers: { accept: 'application/json' } }); const j = await r.json(); return j.data || []; } catch (e) { return []; } }
const waitHook = (h, n = 1, sec = 45) => waitFor(async () => { const q = await hookReqs(h); return q.length >= n ? q : null; }, sec, 3000);
const WH = (h, body, extra) => ({ type: 'Webhook', url: h.url, method: 'POST', bodyTemplate: body || '{"subject":"${subject}","id":"${recordId}"}', headers: { 'X-QA': 'wf' }, timeoutSeconds: 10, ...(extra || {}) });
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { content_html: `<p>${text || 'QA WF comment'}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
// TR-03..TR-11 record-action triggers (API sources)
const out = {};
// rules
const rC = await mkRule('TRC', { kind: 'RecordCreated' }, [FU({ classification: 'Problem' })]);
const rE = await mkRule('TRE', { kind: 'RecordUpdated' }, [FU({ classification: 'Problem' })]);
const rCE = await mkRule('TRCE', { kind: 'RecordCreatedOrUpdated' }, [FU({ classification: 'Problem' })]);
const h = await hook();
const rD = await mkRule('TRD', { kind: 'RecordDeleted' }, [WH(h, '{"deleted":"${subject}","p":"${priority}"}')]);
out.save = { C: rC.s, E: rE.s, CE: rCE.s, D: rD.s, Derr: rD.err };
// TR-03: On Create fires once on create; not on edit / comment / delete
const t1 = await mkTicket('TRC'); await waitTicket(t1.id, x => x.classification === 'Problem' || x.classification === 'problem', 40);
await patchTicket(t1.id, { priority: 'high' }); await comment(t1.id, false);
await sleep(20000); out.TR03 = { firedC: await fired(t1.id, rC.id), cls: (await getTicket(t1.id)).classification };
// TR-04/05: On Edit not on create, fires on PATCH once
const t2 = await mkTicket('TRE'); await sleep(20000); const before = await fired(t2.id, rE.id);
await patchTicket(t2.id, { priority: 'high' }); await waitFor(async () => (await fired(t2.id, rE.id)) > 0, 40);
out.TR05 = { onCreate: before }; out.TR04 = { afterEdit: await fired(t2.id, rE.id) };
// TR-06 same value save
await sleep(5000); const n1 = await fired(t2.id, rE.id); await patchTicket(t2.id, { priority: 'high' }); await sleep(20000); out.TR06 = { before: n1, after: await fired(t2.id, rE.id) };
// TR-07 create or edit
const t3 = await mkTicket('TRCE'); await waitFor(async () => (await fired(t3.id, rCE.id)) > 0, 40); const c1 = await fired(t3.id, rCE.id);
await patchTicket(t3.id, { priority: 'low' }); await waitFor(async () => (await fired(t3.id, rCE.id)) > c1, 40); out.TR07 = { create: c1, afterEdit: await fired(t3.id, rCE.id) };
// TR-11 close / reopen = edit
await patchTicket(t2.id, { status: 'Closed' }); await sleep(15000); const k1 = await fired(t2.id, rE.id);
await patchTicket(t2.id, { status: 'Open' }); await sleep(15000); out.TR11 = { afterClose: k1, afterReopen: await fired(t2.id, rE.id), statusNow: (await getTicket(t2.id)).status };
// TR-08 delete
const t4 = await mkTicket('TRD', { priority: 'urgent' }); await sleep(5000); const d = await delTicket(t4.id);
const got = await waitHook(h, 1, 60); out.TR08 = { del: d.s, hook: got ? got.map(x => x.content).slice(0, 2) : 'none', exec: (await execs(t4.id, rD.id)).map(outcome) };
out.ids = { rC: rC.id, rE: rE.id, rCE: rCE.id, rD: rD.id, t1: t1.id, t2: t2.id, t3: t3.id, t4: t4.id };
fs.writeFileSync(RUN + '/out/tr.json', JSON.stringify(out, null, 1));
return out;
