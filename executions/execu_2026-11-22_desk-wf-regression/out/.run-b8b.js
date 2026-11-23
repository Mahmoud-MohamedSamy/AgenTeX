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
const out = {}; const R = {}; const TK = {};
const OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', TEAM = 'fa641d99-ce7f-47ca-94e7-b15113bd4913';
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const tl = (await api('GET', '/desk/email-templates')).j?.data?.email_templates || [];
const agentT = tl.find(t => t.notification_type === 'agent' && t.module === 'desk_tickets'), teamT = tl.find(t => t.notification_type === 'team' && t.module === 'desk_tickets') || agentT, contT = tl.find(t => t.notification_type === 'contact' && t.module === 'desk_tickets');
out.tpls = { agent: agentT?.name, team: teamT?.name, contact: contT?.name };
const E = (tpl, rec) => ({ type: 'Email', emailTemplateId: tpl.id, emailSubject: tpl.subject || 'QA WF', emailBody: tpl.body_html || 'QA WF', emailRecipients: rec });
const mk = async (k, a) => { const r = await mkRule(k, { kind: 'RecordCreated' }, [a]); R[k] = r.id; out[k + ' save'] = r.s + ' ' + (r.err || ''); };
await mk('AC15teamT', E(teamT, [{ kind: 'Team', value: TEAM }]));
await mk('AC15contT', E(contT, [{ kind: 'Contact', value: 'contact_id' }]));
await mk('AC16agentToContact', E(agentT, [{ kind: 'Contact', value: 'contact_id' }]));
await mk('AC15agentT', E(agentT, [{ kind: 'User', value: OWN }]));
// macro
const mc = await api('POST', '/desk/macros', { name: 'QA WF IN04 macro', department_id: DEPT2, is_active: true, actions: [{ kind: 'set_field', field_key: 'classification', value: 'Problem' }], usable_by: [] });
const MAC = mc.j?.data?.id || mc.j?.data?.macro?.id; out.macro = mc.s + ' ' + (MAC || mc.t.slice(0, 300)); if (MAC) ledger(`macro "QA WF IN04 macro" ${MAC}`);
R.IN04 = (await mkRule('IN04x', { kind: 'RecordUpdated' }, [FU({ qa_ndc_company_name: 'MACRO-EDIT' })], { criteria: changed('classification') })).id;
await sleep(2000);
for (const k of ['AC15teamT', 'AC15contT', 'AC16agentToContact', 'AC15agentT']) if (R[k]) await tk(k, k);
await tk('IN04', 'IN04x');
await sleep(8000);
if (MAC) out.apply = (await api('POST', '/desk/tickets/bulk/macro', { ticket_ids: [TK.IN04], macro_id: MAC })).t.slice(0, 250);
// PS-09 bin with longer wait + any app key
const pr = await mkRule('PS09y', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'x' })]); out.ps09 = { del: (await api('DELETE', '/workflow/rules/' + pr.id)).s };
let bi = null; for (let i = 0; i < 8 && !bi; i++) { await sleep(5000); const items = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data); bi = items.find(x => x.record_id === pr.id) || items.find(x => /QA WF PS09y/.test(x.record_label || '')); }
out.ps09.inBin = bi ? (bi.record_label + ' / ' + bi.module_label) : false;
if (bi) { out.ps09.restore = (await api('POST', '/audit/recycle-bin/restore', { ids: [bi.id] })).s; await sleep(6000); const back = (await allRules()).find(x => x.id === pr.id || x.name === 'QA WF PS09y'); out.ps09.after = back ? { name: back.name, active: back.isActive } : 'not back'; if (back) { await api('DELETE', '/workflow/rules/' + back.id); await sleep(6000); const b2 = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).find(x => /QA WF PS09y/.test(x.record_label || '')); out.ps09.purge = b2 ? (await api('POST', '/audit/recycle-bin/delete', { ids: [b2.id] })).s : 'not in bin 2'; } }
await sleep(25000);
for (const k of ['AC15teamT', 'AC15contT', 'AC16agentToContact', 'AC15agentT']) if (TK[k]) out[k] = await disp(k, k);
if (MAC) { const g = await getTicket(TK.IN04); out.IN04 = { cls: g.classification, company: g.qa_ndc_company_name, run: await disp('IN04', 'IN04') }; }
return out;
