const o = {}; const D1 = 'a373cfd1-85e8-495d-af9a-1a003d2a08a3';
const cond = { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA RT27 3230', caseInsensitive: false };
const act = v => [{ order: 0, delaySeconds: 0, type: 'FieldUpdate', fieldUpdates: { qa_ndc_agency_code: { kind: 'string', stringValue: v } } }];
const c = await api.O('POST', '/workflow/rules', { moduleId: T, name: 'QA RT27 3230 rule', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: cond, actions: act('A1'), departmentIds: [D1] });
const id = c.j?.data?.id; ST.R3230 = id; saveState(); ledger('rule QA RT27 3230 rule ' + id); o.create = E(c);
const crit = async () => { const r = await api.O('GET', '/workflow/rules/' + id); const d = r.j?.data; return { s: r.s, criteria: JSON.stringify(d?.criteria), name: d?.name, action: d?.actions?.[0]?.fieldUpdates?.qa_ndc_agency_code?.stringValue }; };
o.afterCreate = await crit();
const p1 = await api.O('PATCH', '/workflow/rules/' + id, { actions: act('A2') }); o.patchActionsOnly = E(p1); o.afterActionsOnly = await crit();
const p2 = await api.O('PATCH', '/workflow/rules/' + id, { name: 'QA RT27 3230 rule renamed' }); o.patchNameOnly = E(p2); o.afterNameOnly = await crit();
// behaviour: non-matching ticket must not fire, matching ticket must fire (control)
const tN = (await mkTicket('O', 'Other subject RT27 3230 nomatch', { department: D1 })).id; const tM = (await mkTicket('O', 'QA RT27 3230 match', { department: D1 })).id; ST.T3230 = [tN, tM]; saveState();
await sleep(20000);
const ex = arr((await api.O('GET', `/workflow/executions?ruleId=${id}&take=50`)).j?.data);
o.firedNonMatching = ex.filter(e => e.recordId === tN && (e.outcome || e.status) === 'Fired').length; o.firedMatching = ex.filter(e => e.recordId === tM && (e.outcome || e.status) === 'Fired').length;
o.markerNonMatching = (await getTicket(tN)).qa_ndc_agency_code || null; o.markerMatching = (await getTicket(tM)).qa_ndc_agency_code || null;
// explicit null clears
const p3 = await api.O('PATCH', '/workflow/rules/' + id, { criteria: null }); o.patchCriteriaNull = E(p3); o.afterNull = await crit();
// put the condition back for the editor check
const p4 = await api.O('PATCH', '/workflow/rules/' + id, { criteria: cond, isActive: false }); o.restoreCond = E(p4) + ' ' + (await crit()).criteria?.slice(0, 60);
return o;
