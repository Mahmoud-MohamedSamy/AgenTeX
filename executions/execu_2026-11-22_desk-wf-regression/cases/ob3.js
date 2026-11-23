const all = await allRules(); const rT = all.find(r => r.name === 'QA WF OBtest');
const tT = (fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => l.includes('"QA WF OBtest ticket"')).pop() || '').split(' ').pop();
const m = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT, triggerKind: 'RecordCreated', fields: { subject: S('QA WF OBtest ticket'), priority: S('high') } });
const n = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT, triggerKind: 'RecordCreated', fields: { subject: S('QA WF OBtest ticket'), priority: S('low') } });
const e0 = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT, triggerKind: 'RecordCreated', fields: {} });
const draft = { moduleId: T, name: 'QA WF OBdraft', mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: cmp('priority', 'Equal', S('high')), actions: [{ order: 0, delaySeconds: 0, type: 'FieldUpdate', fieldUpdates: { qa_ndc_company_name: S('T') } }], departmentIds: [DEPT] };
const ev = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { priority: S('high') } } });
const ev2 = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: tT, triggerKind: 'RecordCreated', fields: { priority: S('high') } } });
return { matchWithSubject: m.t.slice(0, 350), noMatch: n.t.slice(0, 120), emptyFieldsRealRecord: e0.t.slice(0, 120), evaluateSampleId: ev.s + ' ' + ev.t.slice(0, 300), evaluateRealId: ev2.s + ' ' + ev2.t.slice(0, 300) };
