const o = {};
const P = (id, pass, note) => { result(id, pass === null ? 'INCONCLUSIVE' : pass ? 'PASS' : 'FAIL', note); o[id] = (pass === null ? 'INC ' : pass ? 'PASS ' : 'FAIL ') + note; };
const mkT = async n => (await mkTicket('O', 'QA PA L ' + n)).id;
const rq = async (t, s) => (await api.A('POST', `/desk/tickets/${t}/approvals`, { subject: 'QA PA ' + s, approver_user_ids: [U.B] })).j?.data?.id;
// L2 workflow rule on ticket_approval_status
const crit = { kind: 'Logical', operator: 'And', operands: [{ kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA PA L ', caseInsensitive: false }, { kind: 'Comparison', field: 'ticket_approval_status', operator: 'Equals', value: { kind: 'string', stringValue: 'approved' } }] };
const rule = await api.O('POST', '/workflow/rules', { moduleId: T, name: 'QA PA WF approved', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordUpdated' }, criteria: crit, actions: [{ order: 0, delaySeconds: 0, type: 'FieldUpdate', fieldUpdates: { qa_ndc_agency_code: { kind: 'string', stringValue: 'QA PA wf ran' } } }], departmentIds: [ST.D1] });
o.rule = E(rule); ST.WFRULE = rule.j?.data?.id; if (ST.WFRULE) ledger('workflow rule QA PA WF approved ' + ST.WFRULE); saveState();
const tA = await mkT('2a'), tR = await mkT('2r'); const aA = await rq(tA, 'L2 approve'), aR = await rq(tR, 'L2 reject');
await sleep(2000);
await decide('B', tA, aA, 'approve', {}); await decide('B', tR, aR, 'reject', { comment: 'QA PA no' });
await sleep(20000);
const xA = await getTicket(tA), xR = await getTicket(tR);
const ex = ST.WFRULE ? arr((await api.O('GET', `/workflow/executions?ruleId=${ST.WFRULE}&take=50`)).j?.data).map(e => (e.recordId === tA ? 'approved-ticket ' : e.recordId === tR ? 'rejected-ticket ' : 'other ') + (e.outcome || e.status)) : [];
P('L2', xA.qa_ndc_agency_code === 'QA PA wf ran' && xR.qa_ndc_agency_code !== 'QA PA wf ran', `rule "On Edit + Approval status = approved" ${o.rule}: approved ticket marker "${xA.qa_ndc_agency_code}" (status field ${xA.ticket_approval_status}); rejected ticket marker "${xR.qa_ndc_agency_code}" (${xR.ticket_approval_status}); executions ${JSON.stringify(ex)}. No dedicated "Approval approved" trigger; uses the Approval Status field`);
// L5 merge pending into another
const t16 = await mkT('5 source'), t17 = await mkT('5 target'); const a16 = await rq(t16, 'L5 merge');
const mg = await api.O('POST', '/desk/tickets/merge', { primary_ticket_id: t17, ticket_ids: [t16], secondary_ticket_ids: [t16] }); o.merge = E(mg) + ' ' + mg.t.slice(0, 300);
await sleep(3000); const a16x = (await api.O('GET', '/desk/approvals/' + a16)).j?.data?.item;
P('L5', mg.s < 300 ? a16x?.status === 'cancelled' : null, `merge -> ${E(mg)}; approval ${a16x?.status} reason ${a16x?.approval?.cancel_reason}`);
// L6 delete + restore
const t18 = await mkT('6 delete'); const a18 = await rq(t18, 'L6 delete');
const dl = await api.O('DELETE', `/modules/${T}/records/${t18}`); await sleep(5000);
const a18d = (await api.O('GET', '/desk/approvals/' + a18)).j?.data?.item?.status;
const bin = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).find(i => /QA PA L 6 delete/.test(JSON.stringify(i)));
const rs = bin ? await api.O('POST', '/audit/recycle-bin/restore', { ids: [bin.id] }) : { s: 0, t: 'not in bin' }; await sleep(4000);
const a18r = (await api.O('GET', '/desk/approvals/' + a18)).j?.data?.item; const inW = (await inbox('B', { list: 'waiting', page_size: 100 })).d?.approvals?.some(x => x.id === a18);
P('L6', a18d === 'cancelled' && a18r?.status === 'cancelled' && !inW, `delete ${E(dl)} -> approval ${a18d}; restore ${E(rs)} -> approval ${a18r?.status}, back in B's list ${inW}`);
// L7 department move
const t19 = await mkT('7 move'); const a19 = await rq(t19, 'L7 move');
const mv = await api.O('PATCH', `/modules/${T}/records/${t19}`, { data: [{ field: 'department', value: enc(ST.D2) }] }); await sleep(4000);
const a19x = (await api.O('GET', '/desk/approvals/' + a19)).j?.data?.item; const bSees = await api.B('GET', '/desk/approvals/' + a19); const sSees = (await inbox('S', { list: 'all_pending', page_size: 100 })).d?.approvals?.find(x => x.id === a19);
P('L7', mv.s < 300 && a19x?.status === 'pending' && (a19x?.approval?.approvers || []).some(a => a.no_access), `move to Dept 2 ${E(mv)}; approval ${a19x?.status}; approvers ${JSON.stringify(a19x?.approval?.approvers)}; B detail -> ${bSees.s}; S (Dept 2 supervisor) sees it ${!!sSees} overdue ${JSON.stringify(sSees?.overdue)}`);
ST.L = { tA, tR, t16, t17, t18, t19 }; saveState(); return o;
