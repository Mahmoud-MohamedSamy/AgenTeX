// NDC-2294 item by item on Anyware (owner). Probes keep rules inactive unless the item needs a run; everything created goes to ledger.md.
const out = {}; const G = 'QA RT 2294 ';
const err = r => r.s + ' ' + (r.j?.data?.id ? 'accepted' : JSON.stringify(r.j?.error?.details || r.j?.error?.message || r.t).slice(0, 300));
const del = async id => (await api('o', 'DELETE', '/workflow/rules/' + id)).s;
// item 3: Record Score / Notes triggers
for (const k of ['RecordScoreChanged', 'RecordScore', 'ScoreChanged', 'NoteAdded', 'RecordNotes']) {
  const r = await api('o', 'POST', '/workflow/rules', X.wf(T.LEADS, G + 'probe trigger ' + k, G + 'PROBE', { trigger: k, actions: [X.fieldUpdate('description', 'x')] }));
  out['3 trigger ' + k] = err(r);
  if (r.j?.data?.id) { out['3 trigger ' + k] += ' stored kind ' + (await api('o', 'GET', '/workflow/rules/' + r.j.data.id)).j?.data?.trigger?.kind; ledger(`workflow rule ${r.j.data.id} probe ${k} — deleted at once: ${await del(r.j.data.id)}`); }
}
// item 4: actions — run Meeting + Call on a QA lead
const w4 = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'item4 actions', G + 'ACT', { actions: [{ type: 'CreateMeeting', activitySubject: 'QA RT 2294 meeting', meetingVenue: 'QA room' }, { type: 'ScheduleCall', activitySubject: 'QA RT 2294 call' }] }), 'workflow rule');
out['4 create'] = err(w4);
if (w4.j?.data?.id) {
  out['4 stored'] = JSON.stringify((await api('o', 'GET', '/workflow/rules/' + w4.j.data.id)).j?.data?.actions?.map(a => [a.type, a.activitySubject, a.meetingVenue]));
  out['4 activate'] = (await api('o', 'POST', `/workflow/rules/${w4.j.data.id}/activate`)).s;
  const l = await X.lead('o', G + 'ACT lead'); out['4 lead'] = l.s + ' ' + l.j?.data?.id; await sleep(30000);
  out['4 runs'] = (await X.executions(l.j?.data?.id)).map(e => e.outcome + ' ' + JSON.stringify((e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseBodyTruncated || d.errorMessage || '').slice(0, 160))));
  out['4 deactivate'] = (await api('o', 'POST', `/workflow/rules/${w4.j.data.id}/deactivate`)).s;
  out.lead4 = l.j?.data?.id;
}
for (const t of ['RunCustomAction', 'CreateConnectedRecord']) {
  const r = await api('o', 'POST', '/workflow/rules', X.wf(T.LEADS, G + 'probe ' + t, G + 'PROBE', { actions: [{ type: t }] }));
  out['4 probe ' + t] = err(r); if (r.j?.data?.id) ledger(`workflow rule ${r.j.data.id} probe ${t} — deleted: ${await del(r.j.data.id)}`);
}
// custom actions available (items 6, 8)
for (const p of ['/workflow/custom-actions', '/custom-actions', '/workflow/functions']) { const r = await api('o', 'GET', p); out['custom actions ' + p] = r.s + ' n=' + arr(r.j?.data).length; }
// item 5: owner assignment by assignment rule + Zoho options stored
const ar = await X.made('o', '/workflow/assignment-rules', {
  moduleId: T.LEADS, layoutId: null, name: G + 'item5 AR', description: null, priority: 10, allowedChannels: ['Api'], fallback: { kind: 'LeaveUnassigned', userId: null, poolCriteria: null },
  entries: [{ condition: X.startsWith('first_name', G + 'AR'), target: { kind: 'Category', members: [{ userId: T.U1, order: 0, kind: 'User' }], poolCriteria: null }, availability: { requireOnline: false, requireOnShift: false }, followUpTask: null }], isActive: false,
}, 'assignment rule');
out['5 AR'] = err(ar);
if (ar.j?.data?.id) {
  const r = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'item5 options', G + 'OWNX', { actions: [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: ar.j.data.id, ownerOnlyOnlineUsers: true, ownerNotifyByEmail: true, ownerTransferRelated: ['tasks'] }] }), 'workflow rule');
  out['5 options create'] = err(r);
  if (r.j?.data?.id) { const a = (await api('o', 'GET', '/workflow/rules/' + r.j.data.id)).j?.data?.actions?.[0]; out['5 stored'] = JSON.stringify({ kind: a?.ownerTargetKind, online: a?.ownerOnlyOnlineUsers, email: a?.ownerNotifyByEmail, transfer: a?.ownerTransferRelated ?? '(absent)' }); out['5 actionKeys'] = Object.keys(a || {}).filter(k => /owner/i.test(k)); }
}
// item 7: approver modes for role / group
for (const [k, mode] of [['role', 'everyone_parallel'], ['role', 'everyone_sequential'], ['role', 'anyone'], ['group', 'everyone_parallel'], ['users', 'everyone_parallel']]) {
  const r = await api('o', 'POST', '/workflow/approval-processes', X.approval(T.LEADS, `${G}appr ${k} ${mode}`, true, false, X.startsWith('first_name', G + 'APPR'), [X.level({ kind: k, values: [k === 'group' ? T.OU_TEAM1 : T.P_SUPERVISOR], mode })], [T.OWNER]));
  const id = r.j?.data?.id; let stored = null;
  if (id) { const full = (await api('o', 'GET', '/workflow/approval-processes/' + id)).j?.data; stored = JSON.stringify(full?.rules?.[0]?.levels?.[0]?.approver); ledger(`approval process ${id} probe ${k}/${mode} — deleted: ${(await api('o', 'DELETE', '/workflow/approval-processes/' + id)).s}`); }
  out[`7 ${k} ${mode}`] = r.s + ' ' + (id ? 'stored approver ' + stored : r.t.slice(0, 220));
}
// item 9: blueprint after-actions on Leads (inactive, read back, deleted)
const after = [{ kind: 'convertLead' }, { kind: 'addTags', tags: ['QA RT 2294'] }, { kind: 'createRecord', targetModuleId: T.TASKS, fieldValues: { subject: 'QA RT 2294 bp task' } }, { kind: 'customAction', customActionId: null }];
const bpOut = {};
for (const a of after) {
  const r = await api('o', 'POST', `/modules/${T.LEADS}/blueprints`, X.blueprint('leads', T.LEADS_STD, null, 'lead_status', `${G}bp ${a.kind}`, X.bpCrit('first_name', G + 'BP'), ['Attempted to Contact', 'Contacted'], [a]));
  const id = r.j?.data?.id; let st = null;
  if (id) { st = JSON.stringify((await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${id}`)).j?.data?.definition?.transitions?.[0]?.after?.actions); ledger(`blueprint ${id} probe ${a.kind} — deleted: ${(await api('o', 'DELETE', `/modules/${T.LEADS}/blueprints/${id}`)).s}`); }
  bpOut[a.kind] = r.s + ' ' + (id ? 'stored ' + st : r.t.slice(0, 260));
}
out['9 blueprint'] = bpOut;
// item 12: several conditions in one rule
const multi = X.wf(T.LEADS, G + 'probe multi', G + 'MULTI', { actions: [X.fieldUpdate('description', 'c1')] });
multi.conditions = [{ criteria: X.startsWith('first_name', G + 'MULTI A'), actions: [X.fieldUpdate('description', 'A')] }, { criteria: null, isElse: true, actions: [X.fieldUpdate('description', 'else')] }];
const m = await api('o', 'POST', '/workflow/rules', multi); out['12 create'] = err(m);
if (m.j?.data?.id) { const g = (await api('o', 'GET', '/workflow/rules/' + m.j.data.id)).j?.data; out['12 stored keys'] = Object.keys(g || {}); out['12 conditions stored'] = JSON.stringify(g?.conditions ?? '(absent)').slice(0, 200); ledger(`workflow rule ${m.j.data.id} probe multi — deleted: ${await del(m.j.data.id)}`); }
return out;
