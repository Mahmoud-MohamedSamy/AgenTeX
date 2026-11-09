// NDC-2294 run checks on Anyware (owner): items 4, 5, 6, 8, 9, 11, 12, 13. Custom action = "NDC agency profile" (GET /agency, read-only).
// Every rule is guarded by a "QA RT 2294 …" name prefix and deactivated at the end; else-branch (item 12) is only stored on an inactive rule.
const out = {}; const G = 'QA RT 2294 '; const CA = 'eb47bade-d582-4fb7-b110-909637eca279';
const err = r => r.s + ' ' + (r.j?.data?.id ? 'accepted' : JSON.stringify(r.j?.error?.details || r.j?.error?.message || r.t).slice(0, 300));
const A = (a, i = 0) => ({ order: i, delaySeconds: 0, ...a });
const active = []; const on = async id => { const s = (await api('o', 'POST', `/workflow/rules/${id}/activate`)).s; active.push(id); return s; };
const dispatches = async id => (await X.executions(id)).map(e => e.outcome + ' ' + JSON.stringify((e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseBodyTruncated || d.errorMessage || '').slice(0, 140))));
try {
  // item 11: scheduled Field Update 120 s (started first, read at the end)
  const w11 = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'item11 sched FU', G + 'SCHED', { actions: [{ type: 'FieldUpdate', delaySeconds: 120, fieldUpdates: { description: X.s('QA RT 2294 scheduled') } }] }), 'workflow rule');
  out['11 create'] = err(w11);
  let l11; if (w11.j?.data?.id) { out['11 activate'] = await on(w11.j.data.id); l11 = (await X.lead('o', G + 'SCHED lead')).j?.data?.id; out['11 lead'] = l11; out['11 createdAt'] = new Date().toISOString(); }
  // item 4: Meeting + Call + Function on create
  const w4 = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'item4 actions', G + 'ACT', { actions: [
    { type: 'CreateMeeting', activitySubject: 'QA RT 2294 meeting', meetingVenue: 'office', activityStartOffsetMinutes: 60, activityDurationMinutes: 30 },
    { type: 'ScheduleCall', activitySubject: 'QA RT 2294 call' },
    { type: 'RunCustomAction', customActionId: CA, customActionInputs: {} }] }), 'workflow rule');
  out['4 create'] = err(w4);
  if (w4.j?.data?.id) { out['4 activate'] = await on(w4.j.data.id); const l = (await X.lead('o', G + 'ACT lead')).j?.data?.id; out['4 lead'] = l; await sleep(30000); out['4 runs'] = await dispatches(l); }
  // item 5: Assign Owner by assignment rule (+ options incl. transfer related records), run
  const arList = arr((await api('o', 'GET', '/workflow/assignment-rules')).j?.data).find(x => x.name === G + 'item5 AR');
  if (arList) {
    const cur = (await api('o', 'GET', '/workflow/assignment-rules/' + arList.id)).j?.data; out['5 AR active'] = (await api('o', 'PATCH', '/workflow/assignment-rules/' + arList.id, { ...cur, isActive: true })).s;
    const w5 = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'item5 run', G + 'AR', { actions: [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: arList.id, ownerOnlyOnlineUsers: false, ownerNotifyByEmail: false, ownerTransferRelatedRecords: true }] }), 'workflow rule');
    out['5 create'] = err(w5);
    if (w5.j?.data?.id) {
      const a = (await api('o', 'GET', '/workflow/rules/' + w5.j.data.id)).j?.data?.actions?.[0]; out['5 stored'] = JSON.stringify({ kind: a?.ownerTargetKind, transfer: a?.ownerTransferRelatedRecords });
      out['5 activate'] = await on(w5.j.data.id); const l = (await X.lead('o', G + 'AR lead')).j?.data?.id; out['5 lead'] = l;
      await X.waitFor(45, async () => (await X.field('o', T.LEADS, l, 'owner')) === T.U1); out['5 owner'] = (await X.field('o', T.LEADS, l, 'owner')) === T.U1 ? 'U1 (rule user)' : await X.field('o', T.LEADS, l, 'owner');
    }
    out['5 AR inactive'] = (await api('o', 'PATCH', '/workflow/assignment-rules/' + arList.id, { ...cur, isActive: false })).s;
  }
  // item 6: review process functions on review events (stored on an inactive process)
  const rp = X.review(T.LEADS, T.LEADS_STD, G + 'item6 review fns', X.startsWith('first_name', G + 'REV'), ['manual'], { email: 'email' }, [T.OWNER]);
  rp.eventFunctions = ['submitted', 'approved', 'rejected', 'resubmitted'].map(e => ({ event: e, customActionId: CA, inputs: {} }));
  const r6 = await X.made('o', '/workflow/review-processes', rp, 'review process'); out['6 create'] = err(r6);
  if (r6.j?.data?.id) out['6 stored'] = JSON.stringify(((await api('o', 'GET', '/workflow/review-processes/' + r6.j.data.id)).j?.data?.eventFunctions || []).map(f => f.event + ':' + (f.customActionId === CA)));
  // item 8: approval Call Function on approval, run
  const ap = X.approval(T.LEADS, G + 'item8 call fn', true, false, X.startsWith('first_name', G + 'APPR8'), [X.levelUsers(T.OWNER)], [T.OWNER], { finalActions: [{ type: 'CallFunction', order: 0, customActionId: CA, customActionInputs: {}, functionName: 'NDC agency profile' }] });
  const a8 = await X.made('o', '/workflow/approval-processes', ap, 'approval process'); out['8 create'] = err(a8);
  if (a8.j?.data?.id) {
    out['8 stored'] = JSON.stringify((await api('o', 'GET', '/workflow/approval-processes/' + a8.j.data.id)).j?.data?.rules?.[0]?.finalActions);
    out['8 active'] = (await api('o', 'PATCH', `/workflow/approval-processes/${a8.j.data.id}/active`, { isActive: true })).s;
    const l = (await X.lead('o', G + 'APPR8 lead')).j?.data?.id; out['8 lead'] = l; await sleep(8000);
    const st = await X.approvalState('o', T.LEADS, l); out['8 state'] = st.s + ' ' + JSON.stringify({ status: st.j?.data?.status, canApprove: st.j?.data?.canApprove, inst: st.j?.data?.instanceId });
    if (st.j?.data?.instanceId) { out['8 approve'] = (await api('o', 'POST', `/workflow/approvals/${st.j.data.instanceId}/approve`, { comment: 'QA RT 2294 approve' })).s; await sleep(20000);
      const h = await X.approvalState('o', T.LEADS, l); out['8 after'] = JSON.stringify(h.j?.data).slice(0, 900);
      out['8 timeline'] = arr((await api('o', 'GET', `/timeline/records/leads/${l}/feed`)).j?.data).map(e => e.entry_type + ' ' + String(e.payload_json || '').slice(0, 120)); }
    out['8 inactive'] = (await api('o', 'PATCH', `/workflow/approval-processes/${a8.j.data.id}/active`, { isActive: false })).s;
  }
  // item 9: blueprint after-actions (inactive, read back) on a pick-list field
  const lay = (await api('o', 'GET', `/modules/${T.LEADS}/layouts/${T.LEADS_STD}`)).j?.data; let opts = [];
  JSON.stringify(lay, (k, v) => { if (v && typeof v === 'object' && (v.apiName === 'lead_source' || v.fieldKey === 'lead_source') && !opts.length) opts = (v.options || v.pickListValues || v.config?.options || v.properties?.options || []).map(o => o.value ?? o.apiValue ?? o.label ?? o); return v; });
  out['9 lead_source options'] = opts.slice(0, 6);
  const states = opts.length >= 2 ? opts.slice(0, 2).map(String) : ['Advertisement', 'Cold Call'];
  const after = [{ kind: 'convertLead' }, { kind: 'addTags', tags: ['QA RT 2294'] }, { kind: 'createRecord', targetModuleId: T.TASKS, fieldValues: { subject: 'QA RT 2294 bp task' } }, { kind: 'customAction', customActionId: CA, inputs: {} }];
  const bp = await api('o', 'POST', `/modules/${T.LEADS}/blueprints`, X.blueprint('leads', T.LEADS_STD, null, 'lead_source', G + 'item9 after-actions', X.bpCrit('first_name', G + 'BP'), states, after));
  out['9 create'] = bp.s + ' ' + (bp.j?.data?.id || bp.t.slice(0, 500));
  if (bp.j?.data?.id) { ledger(`blueprint ${bp.j.data.id} "${G}item9 after-actions" (inactive)`); out['9 stored'] = JSON.stringify((await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${bp.j.data.id}`)).j?.data?.definition?.transitions?.[0]?.after?.actions); }
  // item 12: several conditions — validation, else stored (inactive), run of conditions 1 and 2
  const mc = (conds, label) => { const b = X.wf(T.LEADS, G + label, G + 'MC A', { actions: [X.fieldUpdate('description', 'QA RT cond1')] }); b.actions = b.actions.map((a, i) => A(a, i)); b.conditions = conds; return b; };
  const dup = await api('o', 'POST', '/workflow/rules', mc([{ criteria: X.startsWith('first_name', G + 'MC A'), actions: [A(X.fieldUpdate('description', 'dup'))] }], 'probe dup'));
  out['12 duplicate criteria'] = err(dup); if (dup.j?.data?.id) ledger(`workflow rule ${dup.j.data.id} probe dup — deleted: ${(await api('o', 'DELETE', '/workflow/rules/' + dup.j.data.id)).s}`);
  const elseFirst = await api('o', 'POST', '/workflow/rules', mc([{ isElse: true, actions: [A(X.fieldUpdate('description', 'else'))] }, { criteria: X.startsWith('first_name', G + 'MC B'), actions: [A(X.fieldUpdate('description', 'B'))] }], 'probe else first'));
  out['12 else not last'] = err(elseFirst); if (elseFirst.j?.data?.id) ledger(`workflow rule ${elseFirst.j.data.id} probe else-first — deleted: ${(await api('o', 'DELETE', '/workflow/rules/' + elseFirst.j.data.id)).s}`);
  const withElse = await X.made('o', '/workflow/rules', mc([{ criteria: X.startsWith('first_name', G + 'MC B'), actions: [A(X.fieldUpdate('description', 'QA RT cond2'))] }, { isElse: true, actions: [A(X.fieldUpdate('description', 'QA RT else'))] }], 'item12 with else (inactive)'), 'workflow rule');
  out['12 with else'] = err(withElse); if (withElse.j?.data?.id) out['12 else stored'] = JSON.stringify((await api('o', 'GET', '/workflow/rules/' + withElse.j.data.id)).j?.data?.conditions).slice(0, 400);
  const run12 = await X.made('o', '/workflow/rules', mc([{ criteria: X.startsWith('first_name', G + 'MC B'), actions: [A(X.fieldUpdate('description', 'QA RT cond2'))] }], 'item12 run'), 'workflow rule');
  out['12 run rule'] = err(run12);
  if (run12.j?.data?.id) { out['12 activate'] = await on(run12.j.data.id);
    const a = (await X.lead('o', G + 'MC A lead')).j?.data?.id, b = (await X.lead('o', G + 'MC B lead')).j?.data?.id, c = (await X.lead('o', G + 'MC C lead')).j?.data?.id; await sleep(25000);
    out['12 results'] = { A: await X.field('o', T.LEADS, a, 'description'), B: await X.field('o', T.LEADS, b, 'description'), C_noMatch: await X.field('o', T.LEADS, c, 'description') }; }
  // item 13: "trigger": [] runs no workflow
  const w13 = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'item13 trigger', G + 'T13', { actions: [X.fieldUpdate('description', 'QA RT 13 ran')] }), 'workflow rule');
  if (w13.j?.data?.id) { await on(w13.j.data.id); const c = (await X.lead('o', G + 'T13 control')).j?.data?.id; const n = (await X.lead('o', G + 'T13 no trigger', {}, T.LEADS_STD, { trigger: [] })).j?.data?.id; await sleep(30000);
    out['13'] = { control: await X.field('o', T.LEADS, c, 'description'), withEmptyTrigger: await X.field('o', T.LEADS, n, 'description') }; }
  // item 11 result
  if (l11) { const left = 150000 - (Date.now() - Date.parse(out['11 createdAt'])); if (left > 0) await sleep(left); out['11 description after ~150 s'] = await X.field('o', T.LEADS, l11, 'description'); out['11 timeline'] = arr((await api('o', 'GET', `/timeline/records/leads/${l11}/feed`)).j?.data).map(e => e.entry_type + ' ' + e.created_at); }
} finally { for (const id of active) out['deactivate ' + id.slice(0, 8)] = (await api('o', 'POST', `/workflow/rules/${id}/deactivate`)).s; }
return out;
