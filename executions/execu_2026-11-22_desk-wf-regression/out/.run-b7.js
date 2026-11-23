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
// Batch 7: AC-15/16 email recipients, CL-12 address, PS-09 recycle bin, IN-04 macro, PF-02 burst, TF-10 probe, permissions read.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', ORG = '7972984b-b5cc-034a-bd96-6de61e3937d0', TEAM = 'fa641d99-ce7f-47ca-94e7-b15113bd4913';
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const mark = FU({ qa_ndc_agency_code: 'WF' });
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; if (!t.id) out[k + ' tk'] = t.s + ' ' + t.err; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
// templates
const tp = await api('GET', '/desk/email-templates'); const tl = tp.j?.data?.templates || tp.j?.data?.items || arr(tp.j?.data); out.templates = tl.slice(0, 40).map(t => (t.name || '') + ' | ' + (t.notification_type || t.type || '') + ' | ' + (t.recipient_type || t.audience || t.module || '')).slice(0, 25);
const agentTpl = tl.find(t => /agent/i.test(JSON.stringify([t.audience, t.recipient_type, t.notification_type, t.category]))); const custTpl = tl.find(t => /contact|customer/i.test(JSON.stringify([t.audience, t.recipient_type, t.notification_type, t.category])));
out.tplPicked = { agent: agentTpl && agentTpl.name, cust: custTpl && custTpl.name };
// AC-15 one rule per recipient kind
const kinds = { User: OWN, Team: TEAM, UserField: 'owner', Contact: 'contact_id', RecordEmailField: 'email' };
// role recipients only if every member of the role is a test account (no mail to real staff)
{ const us = arr((await api('GET', '/iam/users?take=200')).j?.data); const byOrg = {}; for (const u of us) (byOrg[u.orgUnitId] = byOrg[u.orgUnitId] || []).push(u);
  const safe = Object.entries(byOrg).find(([o, m]) => m.length && m.every(u => [TU1, OWN, '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4'].includes(u.userId || u.id)));
  out.roleCheck = safe ? { org: safe[0], members: safe[1].map(u => u.displayName) } : 'no role made only of test accounts — role recipients not sent';
  if (safe) kinds.OrgUnit = safe[0]; }
for (const [k, v] of Object.entries(kinds)) { const r = await mkRule('AC15' + k, CR, [{ type: 'Email', emailRecipients: [{ kind: k, value: v }], emailSubject: 'QA WF AC15 ' + k + ' ${subject}', emailBody: 'QA WF AC15 body ${priority}' }]); R['AC15' + k] = r.id; if (!r.id) out['AC15' + k + ' save'] = r.s + ' ' + r.err; }
if (agentTpl) { const r = await mkRule('AC15tpl', CR, [{ type: 'Email', emailTemplateId: agentTpl.id, emailRecipients: [{ kind: 'User', value: OWN }] }]); R.AC15tpl = r.id; if (!r.id) out['AC15tpl save'] = r.s + ' ' + r.err; }
// AC-16 agent template to contact; no recipient; no template + no body
if (agentTpl) { const r = await mkRule('AC16c', CR, [{ type: 'Email', emailTemplateId: agentTpl.id, emailRecipients: [{ kind: 'Contact', value: 'contact_id' }] }]); R.AC16c = r.id; out.AC16contact = r.s + ' ' + (r.err || 'saved'); }
{ const r = await mkRule('AC16n', CR, [{ type: 'Email', emailRecipients: [], emailSubject: 's', emailBody: 'b' }], { active: false }); out.AC16noRecipient = r.s + ' ' + (r.err || 'saved'); if (r.id) R.AC16n = r.id; }
{ const r = await mkRule('AC16e', CR, [{ type: 'Email', emailRecipients: [{ kind: 'User', value: OWN }] }], { active: false }); out.AC16noTemplateNoBody = r.s + ' ' + (r.err || 'saved'); if (r.id) R.AC16e = r.id; }
// CL-12 address
for (const [k, c] of Object.entries({ CL12c: sm('qa_rt18_address', 'Contains', 'Cairo', true), CL12n: ex('qa_rt18_address', 'IsNotNull'), CL12e: ex('qa_rt18_address', 'IsNull') })) { const r = await mkRule(k, CR, [mark], { criteria: c }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; }
await sleep(2000);
for (const k of Object.keys(kinds)) await tk('AC15' + k, 'AC15' + k);
if (R.AC15tpl) await tk('AC15tpl', 'AC15tpl'); if (R.AC16c) await tk('AC16c', 'AC16c');
const addr = { kind: 'object', properties: { street: { kind: 'string', value: '1 Tahrir St' }, city: { kind: 'string', value: 'Cairo' }, country: { kind: 'string', value: 'Egypt' } } };
for (const k of ['CL12c', 'CL12n', 'CL12e']) { const r = await api('POST', `/modules/${T}/records`, { data: [['subject', `QA WF ${k} ticket`], ['status', 'Open'], ['department', DEPT2], ['priority', 'medium'], ['channel', 'web']].map(([f, x]) => ({ field: f, value: enc(x) })).concat(k === 'CL12e' ? [] : [{ field: 'qa_rt18_address', value: addr }]), layout_id: STD_LAYOUT }); TK[k] = r.j?.data?.id; if (TK[k]) ledger(`ticket "QA WF ${k} ticket" ${TK[k]}`); else out[k + ' tk'] = r.s + ' ' + r.t.slice(0, 200); }
// PS-09 recycle bin restore + purge of a rule
const pr = await mkRule('PS09', CR, [mark]); const d1 = await api('DELETE', '/workflow/rules/' + pr.id); await sleep(5000);
const binItem = arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id);
out.PS09 = { del: d1.s, inBin: !!binItem, label: binItem && binItem.record_label };
if (binItem) { const rs = await api('POST', '/audit/recycle-bin/restore', { ids: [binItem.id] }); await sleep(4000); const back = (await allRules()).find(x => x.id === pr.id); out.PS09.restore = rs.s; out.PS09.after = back ? { active: back.isActive, name: back.name } : 'not back'; await api('DELETE', '/workflow/rules/' + pr.id); await sleep(4000); const b2 = arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); if (b2) { const pg = await api('POST', '/audit/recycle-bin/delete', { ids: [b2.id] }); out.PS09.purge = pg.s; await sleep(3000); out.PS09.afterPurge = !!arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); } }
// IN-04 macro
const mp = await api('POST', '/desk/macros', {}); out.macroProbe = mp.s + ' ' + mp.t.slice(0, 500);
// TF-10 field probe (no create)
const fp = await api('POST', `/modules/${T}/fields`, {}); out.fieldProbe = fp.s + ' ' + fp.t.slice(0, 400);
// PF-02 burst: 5 active rules, 50 tickets in ~1 minute
const pfR = []; for (let i = 0; i < 5; i++) { const r = await mkRule('PF02 r' + i, CR, [FU({ ['qa_ndc_agency_code']: 'B' + i })], { noGuard: true, criteria: guard('QA WF PF02 ') }); pfR.push(r.id); }
const t0 = Date.now(); const ids = []; for (let i = 0; i < 50; i++) { const t = await mkTicket('PF02', { department: DEPT2 }, 'n' + i); ids.push(t.id); }
out.PF02create = Math.round((Date.now() - t0) / 1000) + ' s for 50 tickets';
await sleep(60000);
let fr = 0, miss = 0; for (const id of ids) { const e = (await execs(id)).filter(x => pfR.includes(x.ruleId) && outcome(x) === 'Fired').length; fr += e; if (e < 5) miss++; }
out.PF02 = { firedRuns: fr + ' of 250', ticketsMissing: miss };
await sleep(30000);
const v = {};
for (const k of Object.keys(kinds)) v['AC15' + k] = await disp('AC15' + k, 'AC15' + k);
if (TK.AC15tpl) v.AC15tpl = await disp('AC15tpl', 'AC15tpl'); if (TK.AC16c) v.AC16c = await disp('AC16c', 'AC16c');
for (const k of ['CL12c', 'CL12n', 'CL12e']) v[k] = { fired: await fired(TK[k], R[k]), addr: JSON.stringify((await getTicket(TK[k])).qa_rt18_address).slice(0, 150) };
out.v = v; out.R = R; out.TK = TK;
fs.writeFileSync(RUN + '/out/b7.json', JSON.stringify(out, null, 1));
return out;
