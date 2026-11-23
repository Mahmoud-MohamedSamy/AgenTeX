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
// OB test rule, SA saved actions, MR chains/loops/order, API security.
const mark = v => FU({ qa_ndc_company_name: v }); const out = {};
// ---------- OB Test rule
const rT = await mkRule('OBtest', { kind: 'RecordCreated' }, [mark('T')], { criteria: cmp('priority', 'Equal', S('high')), active: false });
const tT = await mkTicket('OBtest', { priority: 'high' });
const e0 = await api('POST', `/workflow/rules/${rT.id}/execute`, {});
const e1 = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT.id });
const e2 = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT.id, fieldValues: { priority: S('low') } });
const ev = await api('POST', '/workflow/rules/evaluate', { rule: rT.body, recordId: tT.id });
await sleep(8000);
out.OB = { emptyBody: e0.s + ' ' + e0.t.slice(0, 250), withRecord: e1.s + ' ' + e1.t.slice(0, 400), withValuesLow: e2.s + ' ' + e2.t.slice(0, 300), evaluate: ev.s + ' ' + ev.t.slice(0, 300), ticketUnchanged: (await getTicket(tT.id)).qa_ndc_company_name || 'unchanged' };
// ---------- SA saved actions
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF saved FU', description: 'x', isActive: true, action: { type: 'FieldUpdate', order: 0, fieldUpdates: { qa_ndc_company_name: S('SAVED1') } } });
const saId = sa.j?.data?.id; if (saId) ledger('saved action QA WF saved FU ' + saId);
const saDup = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF saved FU', description: 'x', isActive: true, action: { type: 'FieldUpdate', order: 0, fieldUpdates: { qa_ndc_company_name: S('SAVED1') } } });
const saDupId = saDup.j?.data?.id; if (saDupId) await api('DELETE', '/workflow/actions/' + saDupId);
const ruse1 = await mkRule('SAuse1', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', standaloneActionId: saId }]);
const ruse2 = await mkRule('SAuse2', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', standaloneActionId: saId }]);
const us = await api('GET', `/workflow/actions/${saId}/usage`);
const ta1 = await mkTicket('SAuse1'); await sleep(20000); const v1 = (await getTicket(ta1.id)).qa_ndc_company_name;
const sav = (await api('GET', '/workflow/actions/' + saId)).j?.data;
const pa = await api('PATCH', '/workflow/actions/' + saId, { name: sav.name, description: sav.description, isActive: true, moduleId: T, action: { ...sav.action, fieldUpdates: { qa_ndc_company_name: S('SAVED2') } } });
const ta2 = await mkTicket('SAuse2'); await sleep(20000); const v2 = (await getTicket(ta2.id)).qa_ndc_company_name;
const de = await api('PATCH', '/workflow/actions/' + saId, { name: sav.name, description: sav.description, isActive: false, moduleId: T, action: { ...sav.action, fieldUpdates: { qa_ndc_company_name: S('SAVED2') } } });
const ta3 = await mkTicket('SAuse1', {}, 'inactive'); await sleep(20000); const v3 = (await getTicket(ta3.id)).qa_ndc_company_name;
const dl = await api('DELETE', '/workflow/actions/' + saId);
out.SA = { create: sa.s, dupName: saDup.s + ' ' + (errOf(saDup) || 'accepted'), usage: us.s + ' ' + us.t.slice(0, 200), run1: v1, patch: pa.s + ' ' + (errOf(pa) || ''), run2afterEdit: v2, deactivate: de.s, run3inactive: v3 || null, dispatch3: (await execs(ta3.id, ruse1.id)).flatMap(e => (e.dispatches || []).map(x => x.status + ' ' + (x.lastError || ''))), deleteInUse: dl.s + ' ' + dl.t.slice(0, 200) };
// ---------- MR chains / loops / order
const rA = await mkRule('MRa', { kind: 'RecordCreated' }, [FU({ priority: 'urgent' })]);
const rB = await mkRule('MRa', { kind: 'SpecificFieldChanged', fieldName: 'priority', fieldNames: ['priority'], fieldMatch: 'any', alsoOnCreate: false }, [mark('CHAIN')], { extra: { name: 'QA WF MRa B' } });
const rLoop = await mkRule('MRloop', { kind: 'RecordUpdated' }, [FU({ qa_ndc_agent_id: I(1) }), mark('LOOP')]);
const rO1 = await mkRule('MRord', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'FIRST' })]);
const rO2 = await mkRule('MRord', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'SECOND' })], { extra: { name: 'QA WF MRord 2' } });
const tA = await mkTicket('MRa'); const tL = await mkTicket('MRloop'); const tO = await mkTicket('MRord');
await sleep(10000); await patchTicket(tL.id, { classification: 'others' });
await sleep(40000);
out.MR = { chain: { priority: (await getTicket(tA.id)).priority, ruleA: await fired(tA.id, rA.id), ruleB_fieldChanged: rB.id ? await fired(tA.id, rB.id) : rB.err, mark: (await getTicket(tA.id)).qa_ndc_company_name || null },
  loop: { runs: await fired(tL.id, rLoop.id) },
  order: { value: (await getTicket(tO.id)).qa_ndc_agency_code, r1: await fired(tO.id, rO1.id), r2: rO2.id ? await fired(tO.id, rO2.id) : rO2.err } };
// reorder: put rO2 before rO1 then new ticket
const ordered = arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=300')).j.data).sort((a, b) => a.position - b.position).map(r => r.id);
const pos = { r1: ordered.indexOf(rO1.id), r2: ordered.indexOf(rO2.id) };
const re = ordered.filter(id => id !== rO2.id); re.splice(re.indexOf(rO1.id), 0, rO2.id);
const ro = await api('PUT', '/workflow/rules/reorder', { moduleId: T, orderedRuleIds: re });
const tO2 = await mkTicket('MRord', {}, 'after'); await sleep(25000);
out.MR.reorder = { before: pos, put: ro.s + ' ' + (errOf(ro) || ''), valueAfter: (await getTicket(tO2.id)).qa_ndc_agency_code };
// ---------- API security
const x = await mkRule('API<script>alert(1)</script>', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: '<img src=x onerror=alert(1)> ${subject}', commentPublic: false }], { active: false });
const xr = x.id ? arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=300')).j.data).find(r => r.id === x.id) : null;
const ssrf = {};
for (const u of ['http://169.254.169.254/latest/meta-data/', 'http://localhost:8080/', 'http://10.0.0.1/', 'http://127.0.0.1/', 'file:///etc/passwd']) { const r = await mkRule('APIssrf' + Object.keys(ssrf).length, { kind: 'RecordCreated' }, [{ type: 'Webhook', url: u, method: 'POST', bodyTemplate: '{}', timeoutSeconds: 5 }], { active: false }); ssrf[u] = r.s + ' ' + (r.err || '').slice(0, 120); if (r.id) await api('DELETE', '/workflow/rules/' + r.id); }
const other = await api('GET', '/workflow/rules/00000000-0000-0000-0000-0000000000aa'); const otherP = await api('PATCH', '/workflow/rules/00000000-0000-0000-0000-0000000000aa', { name: 'x' });
out.API = { xssName: x.s + ' stored=' + (xr ? JSON.stringify(xr.name) : '-'), ssrf, unknownId: other.s + '/' + otherP.s };
if (x.id) await api('DELETE', '/workflow/rules/' + x.id);
fs.writeFileSync(RUN + '/out/ob.json', JSON.stringify(out, null, 1));
return out;
