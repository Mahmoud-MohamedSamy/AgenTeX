// G14 (CRM) / G18 (Desk): QA blueprint on the QA layout. Transition Open->Reject asks for qa_vr_text; after-action writes qa_vr_note = BAD-after
const mid = await modId(); const L = I.layout; const o = {};
const def = { name: P + ' BP', description: 'qa', layoutId: L, moduleKey: APP === 'desk' ? 'desk_tickets' : 'leads', targetField: 'qa_vr_pick', continuous: false, ...(APP === 'desk' ? { departmentId: I.base.department } : {}), entryCriteria: null,
  states: [{ id: 'Open', name: 'Open', position: { x: 80, y: 80 }, isTerminal: false }, { id: 'Reject', name: 'Reject', position: { x: 340, y: 80 }, isTerminal: false }, { id: 'Done', name: 'Done', position: { x: 600, y: 80 }, isTerminal: true }],
  transitions: [{ id: 't_qa_1', name: 'QA to Reject', fromStateId: 'Open', toStateId: 'Reject', color: '#2563eb', before: { visibilityCriteria: null }, during: { tags: [], checklist: [], requireNote: false, requiredFields: [{ name: 'qa_vr_text', required: true, datatype: { key: 'single_line' } }], fieldValidations: [], requireAttachment: false, instructionalMessage: 'qa' }, after: { actions: [{ kind: 'setField', field: 'qa_vr_note', value: 'BAD-after' }] } },
    { id: 't_qa_2', name: 'QA to Done', fromStateId: 'Reject', toStateId: 'Done', color: '#2563eb', before: { visibilityCriteria: null }, during: { tags: [], checklist: [], requireNote: false, requiredFields: [], fieldValidations: [], requireAttachment: false, instructionalMessage: null }, after: { actions: [] } }] };
if (!I.bp) {
  const c = await api('POST', '/modules/' + mid + '/blueprints', { definition: def, ...def }); o.create = SR(c).slice(0, 400);
  if (!(c.j && c.j.data)) return o; I.bp = c.j.data.id; SAVE(); LED('blueprint ' + I.bp);
  const p = await api('POST', '/modules/' + mid + '/blueprints/' + I.bp + '/publish', {}); o.publish = SR(p).slice(0, 300);
}
const g = await api('GET', '/modules/' + mid + '/blueprints/' + I.bp); o.active = g.j && g.j.data && g.j.data.isActive;
return o;
