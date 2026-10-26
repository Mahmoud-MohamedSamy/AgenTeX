const body = { moduleId: MODS.leads, appKey: 'crm', layoutId: null, departmentIds: [], name: 'QA W2 WF import guard', description: null, mode: 'Recurring', isActive: false,
  trigger: { kind: 'RecordCreated', fieldName: null, fieldNames: null, fieldMatch: null, dateFieldName: null, offsetSeconds: null, offsetMode: null },
  criteria: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'QA W2 WF', caseInsensitive: false, negate: null },
  actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { description: { kind: 'string', stringValue: 'QA W2 WF ran' } } }] };
const c = await call('POST', '/workflow/rules', body);
if (c.s >= 300) return { create: c.s + ' ' + c.t.slice(0, 400) };
const id = c.j.data.id || c.j.data.ruleId;
const a = await call('POST', `/workflow/rules/${id}/activate`);
const s = v => ({ kind: 'string', value: v });
const ctl = await call('POST', `/modules/${MODS.leads}/records`, { layout_id: 'bf971461-2edc-45f2-b6e4-6e180aa64288', data: [{ field: 'first_name', value: s('QA W2 WF control') }, { field: 'phone', value: s('01014000001') }, { field: 'single_line_3_9', value: s('QA W2') }] });
const cid = ctl.j.data.id; let desc = null;
for (let i = 0; i < 20 && !desc; i++) { await new Promise(r => setTimeout(r, 3000)); const g = await call('GET', `/modules/${MODS.leads}/records/${cid}`); const x = g.j.data.data.find(e => e.field === 'description'); desc = x && x.value && x.value.value; }
return { rule: id, activate: a.s, control: cid, controlDescription: desc };
