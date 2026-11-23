const out = {};
const mk = (crit, depts, fu) => ({ moduleId: T, name: 'QA WF RTOB draft', mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: crit, actions: [{ order: 0, delaySeconds: 0, ...FU(fu) }], departmentIds: depts });
const sr = p => ({ recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { priority: S(p) } });
const c = cmp('priority', 'Equal', S('high'));
const cases = { morningExactHigh: [mk(c, [DEPT2], { qa_ndc_company_name: 'T' }), sr('high')], morningExactLow: [mk(c, [DEPT2], { qa_ndc_company_name: 'T' }), sr('low')], deptOnly: [mk(c, [DEPT2], { description: 'T' }), sr('high')], customFieldNoDept: [mk(c, [], { qa_ndc_company_name: 'T' }), sr('high')] };
for (const [k, [rule, s]] of Object.entries(cases)) { const r = await api('POST', '/workflow/rules/evaluate', { rule, sampleRecord: s }); out[k] = r.s + ' ' + (r.j?.data ? 'matched=' + r.j.data.criteriaMatched + ' actions=' + (r.j.data.actionsThatWouldFire || []).length : r.t.slice(0, 140)); }
return out;
