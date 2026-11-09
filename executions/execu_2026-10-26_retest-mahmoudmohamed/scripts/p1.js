// Probe validation messages (requests are invalid on purpose, so nothing is saved).
const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const out = {};
const base = r => ({ moduleId: T, name: 'QA WF probe', isActive: false, mode: 'Recurring', criteria: { conditions: [], pattern: null }, actions: [], ...r });
out.badTrigger = (await api('POST', '/workflow/rules', base({ trigger: { kind: 'QaInvalidKind' } }))).t;
out.badAction = (await api('POST', '/workflow/rules', base({ trigger: { kind: 'RecordCreated' }, actions: [{ type: 'qa_invalid_type', config: {} }] }))).t;
const r = await api('GET', '/workflow/rules/7b912f37-357a-4683-933b-ccee9fe3076c'); out.sample = JSON.stringify(r.j?.data).slice(0, 1500);
return done(out);
