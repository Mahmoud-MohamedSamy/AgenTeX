// Batch 2 (run 2): triggers/modes (TR-09, TR-10, TD-04/05, RM-03/04/06/10, TE-04/11/12, TC-04) + actions (AC-04/05/09/10/11/12/17/20/25, AT-03/05, AM-01, AX-08).
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' }, CE = { kind: 'RecordCreatedOrUpdated' };
const FCT = (fields, o = {}) => ({ kind: 'SpecificFieldChanged', fieldName: fields[0], fieldNames: fields, fieldMatch: o.match || 'any', alsoOnCreate: !!o.onCreate });
const ev = (events, extra) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(extra || {}) } });
const DT = (sec, mode) => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: sec, offsetMode: mode || 'wall_clock' });
const D2 = { department: DEPT2 };
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { ...D2, ...(vals || {}) }, suf); TK[k] = t.id; if (!t.id) out[k + ' ticket'] = t.s + ' ' + t.err; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 140) + ')' : '')).join(','));
const at = s => new Date(Date.now() + s * 1000).toISOString();

// rerun: delete the 15 rules left by the aborted first try; reuse team / assignment rules / department
for (const id of ['b124a661-8e07-4b82-a408-2d61dae8e236','933b1389-762a-438d-9728-b361664e867f','fa9f7794-22da-48ad-bc93-a963304115ba','fae77d25-2232-43ff-9a41-13c417fddb76','6535705f-d1c2-4122-8192-1a58f7bcc0b1','1fc14be1-9c58-4737-8460-82c63288a983','9b4ca823-047a-495d-b3c9-cb7c25f999ac','d84f1161-fd81-4057-84da-5ab851fd3998','da109e35-9733-4bdb-b655-248654fc6787','d46e3c6d-b73c-40ff-ac03-beeb22e916ad','29c5818e-6778-4860-a03c-7dbe1a48ba20','26f7dd4f-3b72-45c8-ab88-177e03bb0a0b','8764e806-4739-4615-9db6-25fdd391402e']) await api('DELETE', '/workflow/rules/' + id);
const TEAM = 'fa641d99-ce7f-47ca-94e7-b15113bd4913', AR_ACT = 'f69db93e-4cdf-42e3-ad08-de8b007e2106', AR_INA = 'b6973a0a-d1b6-4f39-aeeb-df6ad3ac62f2', AR_RR = 'a629693f-db61-4d13-8f00-f12fe01024f4';
// ---------- rules
const hDel = await hook(); await rule('TR09', { kind: 'RecordDeleted' }, [WH(hDel)]);
await rule('TR09c', CR, [WH(hDel, '{"ev":"create","s":"${subject}"}')], { noGuard: true, criteria: AND(guard('QA WF TR09 '), sm('subject', 'Contains', 'restored')) });
await rule('TR10', UP, [FU({ qa_ndc_agency_code: 'LOOP' })]);
await rule('TD04h', DT(-3600), [mark]); await rule('TD04d', DT(-86400), [mark]); await rule('TD04a', DT(3600), [mark]);
await rule('TD05', DT(0), [mark]);
await rule('RM03e', ev(['comment']), [mark], { mode: 'OneTime' });
await rule('RM03d', DT(-60), [mark], { mode: 'OneTime' });
await rule('RM04', UP, [mark], { mode: 'OneTime' });
const TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a';
await rule('RM06a', CR, [{ type: 'ChangeTicketLayout', ticketLayoutId: TLR }], { layoutId: STD_LAYOUT });
await rule('RM06b', UP, [mark], { layoutId: STD_LAYOUT, noGuard: true, criteria: guard('QA WF RM06') });
// RM-10 department in scope: inactive and deleted
const ND = '7122e4d4-8f6e-4d6e-8e0f-a96203e6c2cc';
if (ND) await rule('RM10', CR, [mark], { departmentIds: [DEPT2, ND] });
const hRep = await hook();
await rule('TE04a', CR, [{ type: 'SendTicketReply', replyIncludeContact: true, replyTo: [], replySubject: '', replyBody: 'QA WF TE04 auto reply ${subject}' }]);
await rule('TE04b', ev(['agent_response']), [WH(hRep)], { noGuard: true, criteria: guard('QA WF TE04a ') });
await rule('TE11', ev(['comment']), [mark]);
await rule('TE12', ev(['comment']), [mark]);
await rule('TC04', DT(-120), [mark], { criteria: cmp('priority', 'Equal', S('high')) });
// actions
await rule('AC04', CR, [{ type: 'FieldUpdate', fieldUpdates: { qa_ndc_ticket: S('') } }]);
await rule('AC04n', CR, [{ type: 'FieldUpdate', fieldUpdates: { qa_ndc_ticket: { kind: 'null' } } }]);
await rule('AC05', CR, [FU({ status: 'Closed' })]);
if (TEAM) { await rule('AC09t', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TEAM }]); await rule('AC09a', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'TeamWithAgent', ownerValue: TEAM }]); }
if (AR_ACT) { await rule('AC10a', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: AR_ACT }]); }
if (AR_INA) await rule('AC10i', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: AR_INA }]);
if (AR_RR) await rule('AC10r', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: AR_RR }]);
await rule('AC11', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: DEV2, ownerOnlyOnlineUsers: true, ownerNotifyByEmail: true, ownerTransferRelatedRecords: true }]);
await rule('AC11b', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1, ownerNotifyByEmail: true, ownerTransferRelatedRecords: true }]);
// AC-12: agent not in DEPT2 (first active non-member user) + suspended user
const users = arr((await api('GET', '/iam/users?take=200')).j?.data);
const outsider = users.find(u => u.status === 'active' && ![TU1, DEV2, OWN].includes(u.id)); const susp = users.find(u => /suspend|inactive|deactiv/i.test(u.status || ''));
out.ac12users = { outsider: outsider && (outsider.displayName + ' ' + outsider.status), suspended: susp ? susp.displayName + ' ' + susp.status : 'none' };
if (outsider) await rule('AC12o', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: outsider.id }]);
if (susp) await rule('AC12s', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: susp.id }]);
// AC-17 free-text email address
const e17 = await mkRule('AC17', CR, [{ type: 'Email', emailRecipients: [{ kind: 'email', value: 'someone@example.com' }], emailSubject: 's', emailBody: 'b' }], { active: false });
out.AC17 = e17.s + ' ' + (e17.err || 'saved'); if (e17.id) { const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === e17.id); out.AC17stored = JSON.stringify(g?.actions?.[0]).slice(0, 300); R.AC17 = e17.id; }
// AC-20 webhook 404, bad URL
let h404; try { const r = await fetch('https://webhook.site/token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ default_status: 404, default_content: 'nope' }) }); const j = await r.json(); h404 = { url: 'https://webhook.site/' + j.uuid, uuid: j.uuid }; } catch (e) { }
if (h404) await rule('AC20n', CR, [WH(h404)]);
await rule('AC20b', CR, [WH({ url: 'https://qa-wf-no-such-host.invalid/hook' })]);
await rule('AC25', CR, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('QA WF x') } }]);
await rule('AT03', CR, [{ type: 'AddTicketComment', commentBody: 'S=${subject} P=${priority} N=${ticket_number} مرحبا بكم ' + 'L'.repeat(3000) + ' END', commentPublic: false }]);
await rule('AT05', CR, [{ type: 'SendTicketReply', replyIncludeContact: false, replyTo: ['mahmoud.mmohamedsamy+qawfat05@gmail.com'], replySubject: 'QA WF AT05', replyBody: 'QA WF AT05 reply without contact' }]);
const hOrd = await hook();
await rule('AM01', CR, [FU({ qa_ndc_agency_code: 'ORD1' }), { type: 'AddTicketComment', commentBody: 'first', commentPublic: false }, { type: 'AddTicketComment', commentBody: 'second', commentPublic: false }, WH(hOrd, '{"code":"${qa_ndc_agency_code}"}'), { type: 'AddTicketComment', commentBody: 'third', commentPublic: false }]);
// AX-08 Function: CRM-only custom action and a deleted id
const cas = arr((await api('GET', '/workflow/custom-actions?take=200')).j?.data); const crmOnly = cas.find(c => !(c.targetApps || []).includes('desk')); const deskCA = cas.find(c => (c.targetApps || []).includes('desk'));
out.ax08 = { crmOnly: crmOnly && crmOnly.name, deskCA: deskCA && (deskCA.name + ' ' + deskCA.status), drafts: cas.filter(c => c.status !== 'active').map(c => c.name + ':' + c.status).slice(0, 5) };
if (crmOnly) { const r = await mkRule('AX08crm', CR, [{ type: 'RunCustomAction', customActionId: crmOnly.id, customActionInputs: {} }], { active: false }); out.AX08crm = r.s + ' ' + (r.err || 'saved'); if (r.id) R.AX08crm = r.id; }
{ const r = await mkRule('AX08del', CR, [{ type: 'RunCustomAction', customActionId: '00000000-0000-0000-0000-0000000000aa', customActionInputs: {} }], { active: false }); out.AX08del = r.s + ' ' + (r.err || 'saved'); if (r.id) R.AX08del = r.id; }
const dr = cas.find(c => c.status !== 'active' && (c.targetApps || []).includes('desk')); if (dr) { const r = await mkRule('AX08dr', CR, [{ type: 'RunCustomAction', customActionId: dr.id, customActionInputs: {} }], { active: false }); out.AX08draft = r.s + ' ' + (r.err || 'saved'); if (r.id) R.AX08dr = r.id; }
await sleep(3000);

// ---------- tickets
await tk('TR09d', 'TR09', {}, 'del'); await tk('TR09r', 'TR09', {}, 'restored'); await tk('TR09s', 'TR09', {}, 'spam'); await tk('TR09m1', 'TR09', {}, 'm1'); await tk('TR09m2', 'TR09', {}, 'm2');
await tk('TR10', 'TR10');
await tk('TD04h', 'TD04h', { due_date: at(3600 + 100) }); await tk('TD04d', 'TD04d', { due_date: at(86400 + 100) }); await tk('TD04a', 'TD04a', { due_date: at(-3600 + 100) });
await tk('TD05', 'TD05', { due_date: at(110) });
await tk('RM03e', 'RM03e'); await tk('RM03d', 'RM03d', { due_date: at(100) });
await tk('RM04', 'RM04');
await tk('RM06', 'RM06a', {}, 'ticket'); // RM06a guard 'QA WF RM06a '
TK.RM06b = TK.RM06; // the same ticket is edited for RM06b; RM06b guard differs → use a second ticket for control
await tk('RM06c', 'RM06b'); // control: STD layout, RM06b fires on edit
if (ND) await tk('RM10', 'RM10');
await tk('TE04', 'TE04a'); // TE04b guard is "QA WF TE04b " → separate ticket that gets a reply from the rule? rule TE04a sends the reply on TE04a tickets only
await tk('TE11', 'TE11', { status: 'Closed' }); await tk('TE12', 'TE12');
await tk('TC04a', 'TC04', { priority: 'high', due_date: at(200) }, 'a'); await tk('TC04b', 'TC04', { priority: 'high', due_date: at(200) }, 'b'); await tk('TC04c', 'TC04', { priority: 'low', due_date: at(200) }, 'c');
await tk('AC04', 'AC04', { qa_ndc_ticket: 'keep' }); await tk('AC04n', 'AC04n', { qa_ndc_ticket: 'keep' }); await tk('AC05', 'AC05');
if (TEAM) { await tk('AC09t', 'AC09t'); await tk('AC09a', 'AC09a'); }
if (AR_ACT) await tk('AC10a', 'AC10a'); if (AR_INA) await tk('AC10i', 'AC10i'); if (AR_RR) await tk('AC10r', 'AC10r');
await tk('AC11', 'AC11'); await tk('AC11b', 'AC11b');
if (outsider) await tk('AC12o', 'AC12o'); if (susp) await tk('AC12s', 'AC12s');
if (h404) await tk('AC20n', 'AC20n'); await tk('AC20b', 'AC20b');
await tk('AC25', 'AC25'); await tk('AT03', 'AT03'); await tk('AT05', 'AT05', { email: undefined }); await tk('AM01', 'AM01');
await sleep(15000);

// ---------- events
await delTicket(TK.TR09d);
await delTicket(TK.TR09r); await sleep(8000);
const bin = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).find(i => i.record_id === TK.TR09r);
out.restore = bin ? (await api('POST', '/audit/recycle-bin/restore', { ids: [bin.id] })).s : 'not in bin';
const sp = await api('POST', '/desk/tickets/bulk/spam', { ticket_ids: [TK.TR09s] }); out.spam = sp.s + ' ' + sp.t.slice(0, 120);
let mg = await api('POST', '/desk/tickets/merge', { primary_ticket_id: TK.TR09m1, ticket_ids: [TK.TR09m2] }); if (mg.s >= 300) mg = await api('POST', '/desk/tickets/merge', { target_ticket_id: TK.TR09m1, source_ticket_ids: [TK.TR09m2] });
out.merge = mg.s + ' ' + mg.t.slice(0, 250);
await patchTicket(TK.TR10, { classification: 'problem' });
await comment(TK.RM03e, false, 'one'); await sleep(5000); await comment(TK.RM03e, false, 'two');
await patchTicket(TK.RM03d, { due_date: at(130) }); // reschedule once while pending
await patchTicket(TK.RM04, { classification: 'problem' }); await sleep(8000);
{ const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.RM04); if (g) { const body = { moduleId: T, name: g.name + ' edited', isActive: true, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: g.actions, departmentIds: g.departmentIds, version: g.version }; const pu = await api('PUT', '/workflow/rules/' + R.RM04, body); out.rm04put = pu.s + (pu.s >= 300 ? ' ' + pu.t.slice(0, 150) : ''); } }
await patchTicket(TK.RM04, { classification: 'question' }); await sleep(8000);
const ac1 = await api('PATCH', '/workflow/rules/' + R.RM04 + '/active', { isActive: false }); const ac1b = ac1.s >= 300 ? await api('PUT', '/workflow/rules/' + R.RM04 + '/active', { isActive: false }) : ac1; await sleep(2000);
const ac2 = await api(ac1.s >= 300 ? 'PUT' : 'PATCH', '/workflow/rules/' + R.RM04 + '/active', { isActive: true }); out.rm04toggle = ac1.s + '/' + ac1b.s + '/' + ac2.s;
await patchTicket(TK.RM04, { classification: 'problem' });
await sleep(10000);
await patchTicket(TK.RM06, { classification: 'problem' }); await patchTicket(TK.RM06c, { classification: 'problem' });
if (ND) { const de = await api('PATCH', '/desk/departments/' + ND, { is_active: false }); out.rm10deactivate = de.s + ' ' + de.t.slice(0, 120); const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.RM10); out.rm10afterInactive = g && { active: g.isActive, depts: g.departmentIds }; await tk('RM10b', 'RM10', {}, 'after'); const dd = await api('DELETE', '/desk/departments/' + ND); out.rm10delete = dd.s + ' ' + dd.t.slice(0, 160); const g2 = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.RM10); out.rm10afterDelete = g2 && { active: g2.isActive, depts: g2.departmentIds }; await tk('RM10c', 'RM10', {}, 'afterdel'); }
await comment(TK.TE11, false, 'on closed'); await api('POST', '/desk/tickets/bulk/spam', { ticket_ids: [TK.TE12] }); await sleep(3000); await comment(TK.TE12, false, 'on spam');
await patchTicket(TK.TC04b, { priority: 'low' }); await patchTicket(TK.TC04c, { priority: 'high' });
await sleep(240000); // date rules (TD05 ~110 s, TD04h/d/a ~100 s, RM03d 130 s, TC04 ~80 s)

// ---------- verdicts
const v = {};
v.TR09 = { hooks: (await hookReqs(hDel)).map(x => x.content).slice(0, 8), restoredTicket: (await getTicket(TK.TR09r))._s, restoreStatus: out.restore, spam: out.spam, merge: out.merge, firedDel: { del: await fired(TK.TR09d, R.TR09), restored: await fired(TK.TR09r, R.TR09), spam: await fired(TK.TR09s, R.TR09), merged: await fired(TK.TR09m2, R.TR09), restoreFiredCreate: await fired(TK.TR09r, R.TR09c) } };
v.TR10 = { runs: (await execs(TK.TR10, R.TR10)).map(outcome), code: (await getTicket(TK.TR10)).qa_ndc_agency_code };
v.TD04 = { hours: await fired(TK.TD04h, R.TD04h), days: await fired(TK.TD04d, R.TD04d), afterPastDate: await fired(TK.TD04a, R.TD04a), pend: (await execs(TK.TD04a, R.TD04a)).map(outcome) };
v.TD05 = await fired(TK.TD05, R.TD05);
v.RM03 = { event: await fired(TK.RM03e, R.RM03e), date: await fired(TK.RM03d, R.RM03d) };
v.RM04 = { runs: (await execs(TK.RM04, R.RM04)).map(outcome), put: out.rm04put, toggle: out.rm04toggle };
v.RM06 = { layoutAfter: (await getTicket(TK.RM06)).layout_id, a: await disp('RM06', 'RM06a'), editAfterMove: await fired(TK.RM06, R.RM06b), control: await fired(TK.RM06c, R.RM06b) };
if (ND) v.RM10 = { first: await fired(TK.RM10, R.RM10), afterInactive: await fired(TK.RM10b, R.RM10), afterDelete: await fired(TK.RM10c, R.RM10), i: out.rm10afterInactive, d: out.rm10afterDelete, del: out.rm10delete, deact: out.rm10deactivate };
v.TE04 = { replyAction: await disp('TE04', 'TE04a'), agentRespFromWorkflow: await fired(TK.TE04, R.TE04b), hooks: (await hookReqs(hRep)).length };
v.TE11 = { fired: await fired(TK.TE11, R.TE11), status: (await getTicket(TK.TE11)).status };
v.TE12 = { fired: await fired(TK.TE12, R.TE12), spam: (await getTicket(TK.TE12)).is_spam };
v.TC04 = { stayHigh: await fired(TK.TC04a, R.TC04), highToLow: await fired(TK.TC04b, R.TC04), lowToHigh: await fired(TK.TC04c, R.TC04), c: (await execs(TK.TC04c, R.TC04)).map(outcome) };
v.AC04 = { empty: JSON.stringify((await getTicket(TK.AC04)).qa_ndc_ticket), emptyRun: await disp('AC04', 'AC04'), nul: JSON.stringify((await getTicket(TK.AC04n)).qa_ndc_ticket), nulRun: await disp('AC04n', 'AC04n') };
{ const g = await getTicket(TK.AC05); v.AC05 = { status: g.status, closed_time: g.closed_time, run: await disp('AC05', 'AC05') }; }
if (TEAM) { const a = await getTicket(TK.AC09t), b = await getTicket(TK.AC09a); v.AC09 = { team: { team: a.team, owner: a.owner, run: await disp('AC09t', 'AC09t') }, teamAgent: { team: b.team, owner: b.owner, run: await disp('AC09a', 'AC09a') } }; }
v.AC10 = {}; for (const k of ['AC10a', 'AC10i', 'AC10r']) if (TK[k]) { const g = await getTicket(TK[k]); v.AC10[k] = { owner: g.owner, run: await disp(k, k) }; }
for (const k of ['AC11', 'AC11b']) { const g = await getTicket(TK[k]); v[k] = { owner: g.owner, run: await disp(k, k) }; }
for (const k of ['AC12o', 'AC12s']) if (TK[k]) { const g = await getTicket(TK[k]); v[k] = { owner: g.owner, run: await disp(k, k) }; }
for (const k of ['AC20n', 'AC20b', 'AC25', 'AT05']) if (TK[k]) v[k] = await disp(k, k);
{ const c = arr((await api('GET', `/desk/tickets/${TK.AT03}/comments`)).j?.data).map(x => x.body_html || x.content_html || ''); v.AT03 = { len: c[0] && c[0].length, head: c[0] && c[0].slice(0, 140), tail: c[0] && c[0].slice(-30), run: await disp('AT03', 'AT03') }; }
{ const c = arr((await api('GET', `/desk/tickets/${TK.AM01}/comments`)).j?.data).map(x => (x.created_at || '') + ' ' + (x.body_html || x.content_html || '').replace(/<[^>]+>/g, '')); v.AM01 = { comments: c, hook: (await hookReqs(hOrd)).map(x => x.content), run: await disp('AM01', 'AM01') }; }
out.v = v; out.R = R; out.TK = TK; out.ids = { TEAM, AR_ACT, AR_INA, AR_RR, ND };
fs.writeFileSync(RUN + '/out/b2.json', JSON.stringify(out, null, 1));
return out;
