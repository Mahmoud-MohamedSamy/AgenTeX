const base = { moduleId: T, name: 'QA WF OB02 probe', mode: 'Recurring', trigger: { kind: 'RecordCreated' }, actions: [{ order: 0, delaySeconds: 0, ...FU({ description: 'T' }) }], departmentIds: [] };
const sr = { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { priority: S('high') } };
const a = await api('POST', '/workflow/rules/evaluate', { rule: { ...base, criteria: null }, sampleRecord: sr });
const b = await api('POST', '/workflow/rules/evaluate', { rule: { ...base, criteria: cmp('priority', 'Equal', S('high')) }, sampleRecord: sr });
return { noCondition: a.s + ' ' + a.t.slice(0, 160), withCondition: b.s + ' ' + b.t.slice(0, 160) };
