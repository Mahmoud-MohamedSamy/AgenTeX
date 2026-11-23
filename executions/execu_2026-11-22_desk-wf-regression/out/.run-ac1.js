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
// Actions batch 1 (instant, On Create, tickets in DEPT2 which has agents).
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', C1 = '639c6788-4dff-4708-8945-af87ef49e996', QAL = 'd6082066-bb4e-446f-acb6-1405c46cfb83';
const TASKS = (arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_tasks') || {}).id;
for (const r of arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=200')).j.data).filter(r => /^QA WF AC[1-4]$/.test(r.name))) await api('DELETE', '/workflow/rules/' + r.id);
const h = await hook();
const tagC = '7397b50e-30dd-4ebb-9abf-7e9468a7cc82', tagD = 'ba388a87-99b7-491e-ab91-2bba95ccd60a';
ledger(`tags zz wf c ${tagC} zz wf d ${tagD}`);
const out = { setup: { TASKS, tagC, tagD } };
// R1: 9 instant actions on one ticket
const A1 = [
  FU({ qa_ndc_agency_code: 'X-${subject}', priority: 'urgent', classification: 'feature', qa_ndc_agent_id: I(42), qa_ndc_issue_date: TS('2026-12-24T00:00:00'), due_date: TS('2026-12-24T12:00:00'), checkbox_displayed_by_layout_rules: B(true) }),
  { type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: DEV2 },
  { type: 'Task', taskTitle: 'QA WF task ${subject}', taskDescription: 'desc', taskDueOffsetDays: 2, taskStatus: 'Not Started', taskPriority: 'High', taskAssigneeUserId: TU1, taskNotifyAssignee: false },
  WH(h, '{"s":"${subject}","p":"${priority}","id":"${recordId}"}', { method: 'PUT', headers: { 'X-QA': 'wf', 'X-Two': '2' } }),
  { type: 'AddTicketComment', commentBody: 'QA WF private comment on ${subject}', commentPublic: false },
  { type: 'AddTicketFollowers', followerUserIds: [TU1] },
  { type: 'ShareTicket', shareDepartmentId: DEPT, shareAccess: 'read_only' },
  { type: 'AddTags', tagIds: [tagC, tagD], mode: 'append' },
  { type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('QA WF title ${subject}') } },
  { type: 'RunCustomAction', customActionId: 'ce1a9907-f037-4465-9148-b17c2e9fc33d', customActionInputs: { ref: '${recordId}', note: 'QA WF' } },
];
const r1 = await mkRule('AC1', { kind: 'RecordCreated' }, A1);
out.r1 = { save: r1.s, err: r1.err };
// R2: remove tags + public comment + reply + change layout
const r2 = await mkRule('AC2', { kind: 'RecordCreated' }, [
  { type: 'RemoveTags', tagIds: [tagD] },
  { type: 'AddTicketComment', commentBody: 'QA WF public comment', commentPublic: true },
  { type: 'SendTicketReply', replyIncludeContact: true, replyTo: ['mahmoud.mmohamedsamy+qawfcc@gmail.com'], replySubject: '', replyBody: 'QA WF auto reply for ${subject}' },
  { type: 'ChangeTicketLayout', ticketLayoutId: QAL },
]);
out.r2 = { save: r2.s, err: r2.err };
const r3 = await mkRule('AC3', { kind: 'RecordCreated' }, [{ type: 'MarkTicketSpam', spamContact: false }]);
out.r3 = { save: r3.s, err: r3.err };
const r4 = TASKS ? await mkRule('AC4', { kind: 'RecordCreated' }, [{ type: 'CreateRecord', targetModuleId: CM, fieldMappings: { name: S('QA WF created contact ${subject}'), last_name: S('QA WF created contact'), email: S('mahmoud.mmohamedsamy+qawfnew@gmail.com') } }]) : {};
out.r4 = { save: r4.s, err: r4.err };
if (!r1.id) return out;
const t1 = await mkTicket('AC1', { department: DEPT2, contact_id: C1 });
const t2 = r2.id ? await mkTicket('AC2', { department: DEPT2, contact_id: C1 }) : {};
if (t2.id) await api('POST', `/desk/tickets/${t2.id}/tags`, { tag_ids: [tagC, tagD] });
const t3 = r3.id ? await mkTicket('AC3', { department: DEPT2 }) : {};
const t4 = r4.id ? await mkTicket('AC4', { department: DEPT2 }) : {};
await sleep(50000);
const g1 = await getTicket(t1.id);
const ex1 = (await execs(t1.id, r1.id)).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 120) + ')' : '')));
const tasks = TASKS ? arr((await api('GET', `/modules/${TASKS}/records?take=20&sort_by=created_at&sort_order=desc`)).j?.data).slice(0, 10).map(r => { const o = {}; for (const x of (r.data || [])) o[x.field] = dec(x.value); return o; }).filter(o => String(o.subject || o.title || o.name || '').includes('QA WF task')) : 'no module';
const c1 = (await api('GET', `/modules/${CM}/records/${C1}`)).j?.data?.data?.find(x => x.field === 'title');
const hooks = await hookReqs(h);
const hist1 = arr((await api('GET', `/desk/tickets/${t1.id}/history`)).j?.data).map(x => x.action + ' ' + x.actor.kind + (x.actor.label ? '/' + x.actor.label : '') + ' ' + x.source);
const cm1 = await api('GET', `/desk/tickets/${t1.id}/comments`);
out.t1 = { id: t1.id, fields: { agency: g1.qa_ndc_agency_code, priority: g1.priority, cls: g1.classification, agent_id: g1.qa_ndc_agent_id, issue: g1.qa_ndc_issue_date, due: g1.due_date, cb: g1.checkbox_displayed_by_layout_rules, owner: g1.owner === DEV2 ? 'DEV2' : g1.owner, tags: g1.tags, followers: g1.followers, shared: g1.shared_departments },
  dispatches: ex1, task: tasks, contactDesc: c1 && dec(c1.value), hook: hooks.map(q => ({ m: q.method, h: q.headers && (q.headers['x-qa'] || q.headers['X-QA']) + '/' + (q.headers['x-two'] || ''), c: q.content })), comments: cm1.s + ' ' + JSON.stringify(arr(cm1.j?.data).map(c => (c.is_public ? 'pub ' : 'priv ') + String(c.content_html || c.content || '').slice(0, 60))), history: hist1 };
if (t2.id) { const g2 = await getTicket(t2.id); const cm2 = await api('GET', `/desk/tickets/${t2.id}/comments`); const th = await api('GET', `/desk/tickets/${t2.id}/threads`);
  out.t2 = { id: t2.id, tags: g2.tags, layout: g2.layout_id || g2.layout, dispatches: (await execs(t2.id, r2.id)).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 160) + ')' : ''))), comments: arr(cm2.j?.data).map(c => (c.is_public ? 'pub ' : 'priv ') + String(c.content_html || '').slice(0, 50)), threads: th.s + ' ' + th.t.slice(0, 400) }; }
if (t3.id) { const g3 = await getTicket(t3.id); out.t3 = { id: t3.id, is_spam: g3.is_spam, dispatches: (await execs(t3.id, r3.id)).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status)) }; }
if (t4.id) out.t4 = { id: t4.id, dispatches: (await execs(t4.id, r4.id)).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 160) + ')' : '') + (d.target ? ' -> ' + d.target : ''))) };
fs.writeFileSync(RUN + '/out/ac1.json', JSON.stringify(out, null, 1));
return out;
