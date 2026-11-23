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
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { content_html: `<p>${text || 'QA WF comment'}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
const mark = v => FU({ qa_ndc_company_name: v });
const out = {};
// webhook receiver answering 500
let h500 = null; try { const r = await fetch('https://webhook.site/token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ default_status: 500, default_content: 'boom' }) }); const j = await r.json(); if (j.uuid) h500 = { url: 'https://webhook.site/' + j.uuid, uuid: j.uuid }; } catch (e) { }
// scheduled save for every type (delay 1 h, inactive, deleted)
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', tagC = '7397b50e-30dd-4ebb-9abf-7e9468a7cc82';
const types = { FieldUpdate: mark('S'), OwnerAssignment: { type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }, AddTags: { type: 'AddTags', tagIds: [tagC], mode: 'append' }, RemoveTags: { type: 'RemoveTags', tagIds: [tagC] }, AddTicketComment: { type: 'AddTicketComment', commentBody: 'S', commentPublic: false }, MarkTicketSpam: { type: 'MarkTicketSpam', spamContact: false }, ShareTicket: { type: 'ShareTicket', shareDepartmentId: DEPT2, shareAccess: 'read_only' }, Task: { type: 'Task', taskTitle: 'QA WF S' }, SendHappinessEmail: { type: 'SendHappinessEmail' } };
out.scheduledSave = {};
for (const [k, a] of Object.entries(types)) { const r = await mkRule('AMs' + k.slice(0, 10), { kind: 'RecordCreated' }, [{ ...a, delaySeconds: 3600 }], { active: false }); out.scheduledSave[k] = r.s + (r.err ? ' ' + r.err.slice(0, 100) : ''); if (r.id) await api('DELETE', '/workflow/rules/' + r.id); }
// S1 delayed FU 120 s
const s1 = await mkRule('AMs1', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 120 }]);
// S2 cancelled when no longer matching
const s2 = await mkRule('AMs2', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 150 }], { criteria: cmp('priority', 'Equal', S('medium')) });
// S3 deactivated / S4 deleted before delay
const s3 = await mkRule('AMs3', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 150 }]);
const s4 = await mkRule('AMs4', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 150 }]);
// failure isolation: webhook 500 + field update
const f1 = h500 ? await mkRule('AMf1', { kind: 'RecordCreated' }, [{ type: 'Webhook', url: h500.url, method: 'POST', bodyTemplate: '{"x":1}', timeoutSeconds: 10 }, mark('AFTER500')]) : { s: 'no receiver' };
const t1 = await mkTicket('AMs1'), t2 = await mkTicket('AMs2'), t3 = await mkTicket('AMs3'), t4 = await mkTicket('AMs4'), tf = f1.id ? await mkTicket('AMf1') : {};
await sleep(45000);
const early = (await getTicket(t1.id)).qa_ndc_company_name;
await patchTicket(t2.id, { priority: 'high' });
await api('POST', '/workflow/rules/' + s3.id + '/deactivate'); await api('DELETE', '/workflow/rules/' + s4.id);
await sleep(150000);
const g = async t => (await getTicket(t.id)).qa_ndc_company_name || null;
const d = async (t, r) => (await execs(t.id, r.id)).flatMap(e => (e.dispatches || []).map(x => x.actionType + ':' + x.status + (x.attempts ? ' x' + x.attempts : '') + (x.lastError ? ' (' + String(x.lastError).slice(0, 80) + ')' : '')));
out.S1 = { at45s: early || null, at3min: await g(t1), dispatch: await d(t1, s1) };
out.S2 = { value: await g(t2), dispatch: await d(t2, s2) };
out.S3 = { value: await g(t3), dispatch: await d(t3, s3) };
out.S4 = { value: await g(t4), dispatch: s4.id ? await d(t4, s4) : '-' };
if (tf.id) out.F1 = { value: await g(tf), dispatch: await d(tf, f1), hits: (await hookReqs(h500)).length };
// ticket events
const ev = (events, extra) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(extra || {}) } });
const eAny = await mkRule('TEany', ev(['comment'], { comments: 'any' }), [mark('EV')]);
const ePub = await mkRule('TEpub', ev(['comment'], { comments: 'public' }), [mark('EV')]);
const ePriv = await mkRule('TEpriv', ev(['comment'], { comments: 'private' }), [mark('EV')]);
const eAR = await mkRule('TEar', ev(['agent_response']), [mark('EV')]);
const ePT = await mkRule('TEpt', ev(['private_thread'], { privateThreads: 'outgoing' }), [mark('EV')]);
const ePTi = await mkRule('TEpti', ev(['private_thread'], { privateThreads: 'incoming' }), [mark('EV')]);
const eMulti = await mkRule('TEmulti', ev(['comment', 'agent_response'], { comments: 'any' }), [mark('EV')]);
const eNone = await mkRule('TEnone', ev([]), [mark('EV')], { active: false });
out.TEsave = { none: eNone.s + ' ' + (eNone.err || '').slice(0, 120) }; if (eNone.id) await api('DELETE', '/workflow/rules/' + eNone.id);
const ta = await mkTicket('TEany'), tp = await mkTicket('TEpub'), tq = await mkTicket('TEpriv'), tr = await mkTicket('TEar'), tt = await mkTicket('TEpt'), tti = await mkTicket('TEpti'), tm = await mkTicket('TEmulti');
await sleep(15000);
const onCreate = { any: await fired(ta.id, eAny.id), ar: await fired(tr.id, eAR.id) };
await comment(ta.id, false); await comment(ta.id, true);
await comment(tp.id, false); await sleep(8000); await comment(tp.id, true);
await comment(tq.id, true); await sleep(8000); await comment(tq.id, false);
const rp = await reply(tr.id); await comment(tr.id, true);
const fw = await api('POST', `/desk/tickets/${tt.id}/replies`, { mode: 'forward', to: ['mahmoud.mmohamedsamy+qawffwd@gmail.com'], subject: 'Fwd: QA WF TEpt', body_html: '<p>QA WF forward</p>' });
const fw2 = await api('POST', `/desk/tickets/${tti.id}/replies`, { mode: 'forward', to: ['mahmoud.mmohamedsamy+qawffwd@gmail.com'], subject: 'Fwd: QA WF TEpti', body_html: '<p>QA WF forward</p>' });
await comment(tm.id, false); await sleep(8000); await reply(tm.id);
await sleep(40000);
out.TE = { onCreate, any_priv_then_pub: await fired(ta.id, eAny.id), publicOnly_priv_then_pub: await fired(tp.id, ePub.id), privateOnly_pub_then_priv: await fired(tq.id, ePriv.id), agentResponse_reply_plus_comment: { reply: rp.s, fired: await fired(tr.id, eAR.id) }, ptOutgoing_forward: { fw: fw.s + ' ' + (errOf(fw) || ''), fired: await fired(tt.id, ePT.id) }, ptIncoming_forward: { fw: fw2.s, fired: await fired(tti.id, ePTi.id) }, multi_comment_then_reply: await fired(tm.id, eMulti.id) };
fs.writeFileSync(RUN + '/out/am.json', JSON.stringify(out, null, 1));
return out;
