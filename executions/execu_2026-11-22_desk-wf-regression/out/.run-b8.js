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
// Batch 8: MR-07, IN-01 (direct switch on → restored off), E2E-05, PF-01, OB-07, IN-04 macro, AC-15/16 redo, PS-09 redo, TF-10 attempt.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', TEAM = 'fa641d99-ce7f-47ca-94e7-b15113bd4913';
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const mark = FU({ qa_ndc_agency_code: 'WF' });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; if (!t.id) out[k + ' tk'] = t.s + ' ' + t.err; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const getRule = async id => (await allRules()).find(x => x.id === id);
const fullPatch = async (id, change) => { const g = await getRule(id); const body = { moduleId: T, name: g.name, description: g.description, isActive: g.isActive, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: g.actions.map(({ id, ...a }) => a), departmentIds: g.departmentIds, version: g.version, ...change(g) }; const r = await api('PATCH', '/workflow/rules/' + id, body); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : ''); };
// templates
const tl = (await api('GET', '/desk/email-templates')).j?.data?.email_templates || [];
const agentTpl = tl.find(t => t.notification_type === 'agent' && t.module === 'desk_tickets'); const contactTpl = tl.find(t => t.notification_type === 'contact' && t.module === 'desk_tickets');
out.tpl = { agent: agentTpl && agentTpl.name, contact: contactTpl && contactTpl.name, types: [...new Set(tl.map(t => t.notification_type))] };
// AC-15 redo
const kinds = { Team: TEAM, Contact: 'contact_id', ContactBlank: '', UserFieldCreatedBy: 'created_by' };
for (const [k, v] of Object.entries(kinds)) await rule('AC15' + k, CR, [{ type: 'Email', emailRecipients: [{ kind: k.startsWith('Contact') ? 'Contact' : k.startsWith('UserField') ? 'UserField' : k, value: v }], emailSubject: 'QA WF AC15 ' + k, emailBody: 'QA WF AC15 ${subject}' }]);
{ const us = arr((await api('GET', '/iam/users?take=200')).j?.data); const orgs = arr((await api('GET', '/iam/org-units')).j?.data); const tid = u => u.userId || u.id; const byOrg = {}; for (const u of us) (byOrg[u.orgUnitId] = byOrg[u.orgUnitId] || []).push(tid(u)); const safe = orgs.find(o => !(byOrg[o.id] || []).length); out.roleEmpty = safe ? safe.name : 'none'; if (safe) await rule('AC15OrgUnit', CR, [{ type: 'Email', emailRecipients: [{ kind: 'OrgUnit', value: safe.id }], emailSubject: 'QA WF AC15 role', emailBody: 'x' }]); }
if (agentTpl) await rule('AC15tpl', CR, [{ type: 'Email', emailTemplateId: agentTpl.id, emailRecipients: [{ kind: 'User', value: OWN }] }]);
if (agentTpl) await rule('AC16c', CR, [{ type: 'Email', emailTemplateId: agentTpl.id, emailRecipients: [{ kind: 'Contact', value: 'contact_id' }] }]);
// MR-07
await rule('MR07x', CR, [{ ...FU({ qa_ndc_company_name: 'MR07-v1' }), delaySeconds: 90 }]);
// IN-01
const ns0 = (await api('GET', '/desk/assignment/notification-settings')).j?.data; fs.writeFileSync(RUN + '/out/assign-switch-orig.json', JSON.stringify(ns0)); ledger('assignment switches saved out/assign-switch-orig.json direct=' + ns0.direct_rules_enabled);
const ar = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA WF IN01 ar2', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF IN01x ' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: DEV2, team_id: null } }] });
const AR = ar.j?.data?.id || ar.j?.data?.rule?.id; if (AR) ledger(`assignment rule "QA WF IN01 ar2" ${AR}`);
await rule('IN01x', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }]);
// E2E-05
const h5 = await hook();
await rule('E2E05x', CR, [WH(h5, '{"id":"${recordId}"}')]);
await rule('E2E05y', UP, [FU({ qa_ndc_company_name: 'E2E05-edit' })], { noGuard: true, criteria: AND(guard('QA WF E2E05x '), cmp('qa_ndc_agency_code', 'Equal', S('FROM-RECEIVER'))) });
// PF-01
await rule('PF01x', CR, [FU({ qa_ndc_company_name: 'PF' })]);
// IN-04 macro
const mc = await api('POST', '/desk/macros', { name: 'QA WF IN04 macro', department_id: DEPT2, actions: [{ type: 'field_update', field: 'classification', value: 'problem' }] });
let MAC = mc.j?.data?.id || mc.j?.data?.macro?.id; out.macro = mc.s + ' ' + (MAC || mc.t.slice(0, 400)); if (MAC) ledger(`macro "QA WF IN04 macro" ${MAC}`);
await rule('IN04', UP, [FU({ qa_ndc_company_name: 'MACRO-EDIT' })], { criteria: changed('classification') });
await sleep(2000);
// tickets
for (const k of ['Team', 'Contact', 'ContactBlank', 'UserFieldCreatedBy', 'OrgUnit', 'tpl']) if (R['AC15' + k]) await tk('AC15' + k, 'AC15' + k);
if (R.AC16c) await tk('AC16c', 'AC16c');
await tk('MR07x', 'MR07x');
// switch direct ON only around the IN-01 ticket
const on = await api('PUT', '/desk/assignment/notification-settings', { ...ns0, direct_rules_enabled: true }); out.switchOn = on.s; ledger('direct switch ON ' + on.s);
try { await tk('IN01x', 'IN01x'); await sleep(20000); const g = await getTicket(TK.IN01x); out.IN01 = { owner: g.owner === TU1 ? 'Test User 1 (workflow)' : g.owner === DEV2 ? 'Dev Team 2 (direct rule)' : g.owner, run: await disp('IN01x', 'IN01x'), history: (await api('GET', `/desk/tickets/${TK.IN01x}/history`)).t.slice(0, 1200) }; }
finally { const off = await api('PUT', '/desk/assignment/notification-settings', { ...ns0 }); const now = (await api('GET', '/desk/assignment/notification-settings')).j?.data; out.switchRestored = off.s + ' direct=' + now.direct_rules_enabled; ledger('direct switch restored ' + out.switchRestored); }
await tk('E2E05x', 'E2E05x');
if (MAC) await tk('IN04', 'IN04');
// MR-07 edit while pending
await sleep(5000); out.mr07patch = await fullPatch(R.MR07x, g => ({ actions: [{ order: 0, delaySeconds: 90, ...FU({ qa_ndc_company_name: 'MR07-v2' }) }] }));
// E2E-05 receiver
const w5 = await waitHook(h5, 1, 60); if (w5) { const b = JSON.parse(w5[0].content || '{}'); out.e2e05recv = b.id === TK.E2E05x; await patchTicket(b.id, { qa_ndc_agency_code: 'FROM-RECEIVER' }); }
// IN-04 apply macro
if (MAC) { const ap = await api('POST', '/desk/tickets/bulk/macro', { ticket_ids: [TK.IN04], macro_id: MAC }); out.macroApply = ap.s + ' ' + ap.t.slice(0, 200); }
// PF-01 proper: 10 sequential tickets, poll each right away
const lat = []; for (let i = 0; i < 10; i++) { const s = Date.now(); const id = await tk('PF' + i, 'PF01x', {}, 'n' + i); let d = null; while (Date.now() - s < 90000) { if ((await getTicket(id)).qa_ndc_company_name === 'PF') { d = Date.now() - s; break; } await sleep(700); } lat.push(d); }
out.PF01 = { ms: lat, median: [...lat].sort((a, b) => a - b)[5] };
// PS-09 redo
const pr = await mkRule('PS09x', CR, [mark]); out.PS09 = { del: (await api('DELETE', '/workflow/rules/' + pr.id)).s }; await sleep(5000);
const bi = arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); out.PS09.inBin = bi ? bi.record_label + ' / ' + bi.module_label : false;
if (bi) { out.PS09.restore = (await api('POST', '/audit/recycle-bin/restore', { ids: [bi.id] })).s; await sleep(5000); const back = await getRule(pr.id); out.PS09.afterRestore = back ? { name: back.name, active: back.isActive } : 'not back'; out.PS09.del2 = (await api('DELETE', '/workflow/rules/' + pr.id)).s; await sleep(5000); const b2 = arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); out.PS09.purge = b2 ? (await api('POST', '/audit/recycle-bin/delete', { ids: [b2.id] })).s : 'not in bin'; await sleep(4000); out.PS09.leftInBin = !!arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); }
await sleep(100000);
const v = {};
for (const k of ['Team', 'Contact', 'ContactBlank', 'UserFieldCreatedBy', 'OrgUnit', 'tpl']) if (TK['AC15' + k]) v['AC15' + k] = await disp('AC15' + k, 'AC15' + k);
if (TK.AC16c) v.AC16c = await disp('AC16c', 'AC16c');
v.MR07 = { value: (await getTicket(TK.MR07x)).qa_ndc_company_name, patch: out.mr07patch, run: await disp('MR07x', 'MR07x') };
v.E2E05 = { recv: out.e2e05recv, company: (await getTicket(TK.E2E05x)).qa_ndc_company_name, editRuns: (await execs(TK.E2E05x, R.E2E05y)).map(outcome), hooks: (await hookReqs(h5)).length };
if (MAC) v.IN04 = { company: (await getTicket(TK.IN04)).qa_ndc_company_name, cls: (await getTicket(TK.IN04)).classification, run: await disp('IN04', 'IN04'), apply: out.macroApply };
const au = await api('GET', '/audit/events?limit=100'); const evs = arr(au.j?.data); v.OB07 = { total: evs.length, wf: evs.filter(e => /workflow/i.test(e.app_key + ' ' + e.action + ' ' + e.target_type)).slice(0, 15).map(e => e.app_key + ' ' + e.action + ' ' + e.target_type + ' ' + (e.target_label || '').slice(0, 40)) };
out.v = v; out.R = R; out.TK = TK;
fs.writeFileSync(RUN + '/out/b8.json', JSON.stringify(out, null, 1));
return out;
