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
async function hook() { const r = await fetch('https://webhook.site/token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: '{}' }); const j = await r.json(); return { url: 'https://webhook.site/' + j.uuid, uuid: j.uuid }; }
async function hookReqs(h) { try { const r = await fetch(`https://webhook.site/token/${h.uuid}/requests?sorting=oldest&per_page=50`, { headers: { accept: 'application/json' } }); const j = await r.json(); return j.data || []; } catch (e) { return []; } }
const waitHook = (h, n = 1, sec = 45) => waitFor(async () => { const q = await hookReqs(h); return q.length >= n ? q : null; }, sec, 3000);
const WH = (h, body, extra) => ({ type: 'Webhook', url: h.url, method: 'POST', bodyTemplate: body || '{"subject":"${subject}","id":"${recordId}"}', headers: { 'X-QA': 'wf' }, timeoutSeconds: 10, ...(extra || {}) });
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { content_html: `<p>${text || 'QA WF comment'}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
const out = {}; const FCT = (fields, o = {}) => ({ kind: 'SpecificFieldChanged', fieldName: fields[0], fieldNames: fields, fieldMatch: o.match || 'any', alsoOnCreate: !!o.onCreate });
const mark = FU({ qa_ndc_agency_code: 'WF' });
// TF-01/02: one watch field per type
const types = { subject: ['QA WF TF02s ticket X', 'subject'], priority: ['high'], description: ['changed desc'], due_date: ['2026-12-30T10:00:00Z'], qa_ndc_agent_id: [77], customer_responded: [true], qa_ndc_issue_date: ['2026-12-01'], qa_ndc_traveling_ticket_number: [12.5] };
const per = {};
for (const [f, [v]] of Object.entries(types)) {
  const tag = 'TF02' + f.slice(0, 6);
  const r = await mkRule(tag, FCT([f]), [mark]);
  const t = await mkTicket(tag);
  await sleep(4000);
  await patchTicket(t.id, { classification: 'question' });           // other field: must NOT fire
  await sleep(12000); const other = await fired(t.id, r.id);
  const p = await patchTicket(t.id, { [f]: f === 'subject' ? `QA WF ${tag} renamed` : v });
  await waitFor(async () => (await fired(t.id, r.id)) > other, 30);
  per[f] = { save: r.s, err: r.err, onCreate: 0, otherField: other, patch: p.s + (p.err ? ' ' + p.err.slice(0, 80) : ''), afterChange: await fired(t.id, r.id) };
}
out.TF02 = per;
// TF-03 any of 3 / TF-04 all of 2
const rA = await mkRule('TF03', FCT(['priority', 'classification', 'description']), [mark]);
const tA = await mkTicket('TF03'); await sleep(3000); await patchTicket(tA.id, { description: 'x' }); await waitFor(async () => (await fired(tA.id, rA.id)) > 0, 30);
out.TF03 = { save: rA.s, err: rA.err, oneOf3: await fired(tA.id, rA.id) };
const rB = await mkRule('TF04', FCT(['priority', 'classification'], { match: 'all' }), [mark]);
const tB = await mkTicket('TF04'); await sleep(3000);
await patchTicket(tB.id, { priority: 'high' }); await sleep(12000); const onlyOne = await fired(tB.id, rB.id);
await patchTicket(tB.id, { priority: 'low', classification: 'feature' }); await waitFor(async () => (await fired(tB.id, rB.id)) > onlyOne, 30);
out.TF04 = { save: rB.s, err: rB.err, oneChanged: onlyOne, bothChanged: await fired(tB.id, rB.id) };
// TF-05 same field twice / 4 fields
const dup = await mkRule('TF05dup', FCT(['priority', 'priority']), [mark]); const four = await mkRule('TF05four', FCT(['priority', 'classification', 'description', 'subject']), [mark]);
out.TF05 = { dup: dup.s + ' ' + (dup.err || ''), four: four.s + ' ' + (four.err || '') };
// TF-06/07 also on create on/off
const rC = await mkRule('TF06', FCT(['priority'], { onCreate: true }), [mark]);
const tC = await mkTicket('TF06'); await waitFor(async () => (await fired(tC.id, rC.id)) > 0, 30); const cc = await fired(tC.id, rC.id);
await patchTicket(tC.id, { classification: 'question' }); await sleep(12000);
out.TF06 = { onCreate: cc, afterOtherEdit: await fired(tC.id, rC.id) };
// TF-08 changed to / changed from
const rD = await mkRule('TF08', FCT(['priority']), [mark], { criteria: { kind: 'ChangedTo', field: 'priority', value: S('urgent') } });
const tD = await mkTicket('TF08'); await sleep(3000); await patchTicket(tD.id, { priority: 'high' }); await sleep(12000); const toHigh = await fired(tD.id, rD.id);
await patchTicket(tD.id, { priority: 'urgent' }); await waitFor(async () => (await fired(tD.id, rD.id)) > toHigh, 30);
const rE = await mkRule('TF08b', FCT(['priority']), [mark], { criteria: { kind: 'ChangedFrom', field: 'priority', value: S('medium') } });
const tE = await mkTicket('TF08b'); await sleep(3000); await patchTicket(tE.id, { priority: 'high' }); await waitFor(async () => (await fired(tE.id, rE.id)) > 0, 30); const fromMed = await fired(tE.id, rE.id);
await patchTicket(tE.id, { priority: 'low' }); await sleep(12000);
out.TF08 = { changedTo: { save: rD.s, err: rD.err, toHigh, toUrgent: await fired(tD.id, rD.id) }, changedFrom: { save: rE.s, err: rE.err, medToHigh: fromMed, highToLow: await fired(tE.id, rE.id) } };
// TF-09 clear and set
const rF = await mkRule('TF09', FCT(['due_date']), [mark]);
const tF = await mkTicket('TF09', { due_date: '2026-12-20T10:00:00Z' }); await sleep(3000);
await patchTicket(tF.id, { due_date: null }); await waitFor(async () => (await fired(tF.id, rF.id)) > 0, 30); const cl = await fired(tF.id, rF.id);
await patchTicket(tF.id, { due_date: '2026-12-21T10:00:00Z' }); await waitFor(async () => (await fired(tF.id, rF.id)) > cl, 30);
out.TF09 = { cleared: cl, set: await fired(tF.id, rF.id), dueNow: (await getTicket(tF.id)).due_date };
fs.writeFileSync(RUN + '/out/tf.json', JSON.stringify(out, null, 1));
return out;
