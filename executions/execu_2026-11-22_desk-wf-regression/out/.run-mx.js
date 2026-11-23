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
// MX: save every trigger x action (inactive, deleted at once). Records status + message class.
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', C_ACT = 'ce1a9907-f037-4465-9148-b17c2e9fc33d', TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a', CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const tagC = '7397b50e-30dd-4ebb-9abf-7e9468a7cc82';
const TR = {
  C: { kind: 'RecordCreated' }, E: { kind: 'RecordUpdated' }, CE: { kind: 'RecordCreatedOrUpdated' }, D: { kind: 'RecordDeleted' },
  FC: { kind: 'SpecificFieldChanged', fieldName: 'priority', fieldNames: ['priority'], fieldMatch: 'any', alsoOnCreate: false },
  DT: { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: -3600, offsetMode: 'wall_clock' },
  CR: { kind: 'TicketEvent', ticketEvents: { events: ['customer_reply'] } }, AR: { kind: 'TicketEvent', ticketEvents: { events: ['agent_response'] } },
  PT: { kind: 'TicketEvent', ticketEvents: { events: ['private_thread'], privateThreads: 'any' } }, CM: { kind: 'TicketEvent', ticketEvents: { events: ['comment'], comments: 'any' } },
  HR: { kind: 'TicketEvent', ticketEvents: { events: ['rating'], ratings: [] } },
};
const AX = {
  FieldUpdate: FU({ qa_ndc_company_name: 'MX' }), OwnerAssignment: { type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 },
  AddTags: { type: 'AddTags', tagIds: [tagC], mode: 'append' }, RemoveTags: { type: 'RemoveTags', tagIds: [tagC] },
  Email: { type: 'Email', emailRecipients: [{ kind: 'user', value: TU1 }], emailSubject: 'QA WF MX', emailBody: 'x' },
  Task: { type: 'Task', taskTitle: 'QA WF MX' }, Webhook: { type: 'Webhook', url: 'https://webhook.site/00000000-0000-0000-0000-000000000000', method: 'POST', bodyTemplate: '{}', timeoutSeconds: 5 },
  CreateRecord: { type: 'CreateRecord', targetModuleId: CM, fieldMappings: { name: S('QA WF MX'), last_name: S('QA WF MX') } },
  SendHappinessEmail: { type: 'SendHappinessEmail' }, UpdateRelatedRecord: { type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('MX') } },
  AddTicketComment: { type: 'AddTicketComment', commentBody: 'MX', commentPublic: false }, SendTicketReply: { type: 'SendTicketReply', replyIncludeContact: true, replyTo: [], replyBody: 'MX' },
  AddTicketFollowers: { type: 'AddTicketFollowers', followerUserIds: [TU1] }, MarkTicketSpam: { type: 'MarkTicketSpam', spamContact: false },
  ShareTicket: { type: 'ShareTicket', shareDepartmentId: DEPT, shareAccess: 'read_only' }, AddTicketSkills: { type: 'AddTicketSkills', skillKeys: ['QA WF skill'] },
  RemoveTicketSkills: { type: 'RemoveTicketSkills', skillKeys: ['QA WF skill'] }, RecalculateTicketSkills: { type: 'RecalculateTicketSkills' }, ReassignTicketBySkills: { type: 'ReassignTicketBySkills' },
  ChangeTicketLayout: { type: 'ChangeTicketLayout', ticketLayoutId: TLR }, SendSlackNotification: { type: 'SendSlackNotification', slackConnectionId: '00000000-0000-0000-0000-000000000000', slackChannelIds: ['C0'], notificationHeader: 'h', notificationBody: 'b' },
  SendTeamsNotification: { type: 'SendTeamsNotification', notificationHeader: 'h', notificationBody: 'b' }, SendGoogleChatNotification: { type: 'SendGoogleChatNotification', notificationHeader: 'h', notificationBody: 'b' },
  ReplyViaIm: { type: 'ReplyViaIm', imText: 'x' }, NotifyViaIm: { type: 'NotifyViaIm', imText: 'x' }, RunCustomAction: { type: 'RunCustomAction', customActionId: C_ACT, customActionInputs: { ref: 'x', note: 'y' } },
  CreateMeeting: { type: 'CreateMeeting', activitySubject: 'x', meetingVenue: 'x', activityStartOffsetMinutes: 0, activityDurationMinutes: 60 }, SendPortalAccess: { type: 'SendPortalAccess', portalId: '00000000-0000-0000-0000-000000000000', resend: false },
};
const grid = {}; let i = 0;
for (const [tk, trig] of Object.entries(TR)) {
  grid[tk] = {};
  for (const [ak, a] of Object.entries(AX)) {
    const r = await api('POST', '/workflow/rules', { moduleId: T, name: `QA WF MX ${tk} ${ak}`, isActive: false, mode: 'Recurring', trigger: trig, criteria: guard('QA WF MX '), actions: [{ order: 0, delaySeconds: 0, ...a }], departmentIds: [DEPT2] });
    const id = r.j?.data?.id; if (id) await api('DELETE', '/workflow/rules/' + id);
    const msg = r.s < 300 ? '' : ((r.j?.error?.details || []).map(d => d.issue || d.message).join('; ') || r.j?.error?.message || r.t).slice(0, 150);
    grid[tk][ak] = r.s + (msg ? ' ' + msg : ''); i++;
  }
}
fs.writeFileSync(RUN + '/out/mx.json', JSON.stringify(grid, null, 1));
const sum = {}; for (const [tk, row] of Object.entries(grid)) sum[tk] = Object.entries(row).filter(([, v]) => !v.startsWith('201')).map(([a, v]) => a + '=' + v.slice(0, 3)).join(' ');
return { cells: i, nonSaved: sum };
