const mid = await modId(); const out = {};
const def = { name: P + ' BP', description: '', moduleKey: 'leads', layoutId: I.layout, layoutName: P + ' Layout', targetField: 'qa_lr_type', continuous: false,
  states: [{ id: 'Question', name: 'Question', position: { x: 80, y: 80 }, isTerminal: false }, { id: 'Refund', name: 'Refund', position: { x: 340, y: 80 }, isTerminal: true }],
  transitions: [{ id: 't_qa_lr_1', name: 'QA to Refund', color: '#2563eb', fromStateId: 'Question', toStateId: 'Refund', before: { visibilityCriteria: null }, during: { tags: [], checklist: [], requireNote: false, requiredFields: [], fieldValidations: [], requireAttachment: false, instructionalMessage: 'QA LR1112 transition' }, after: { actions: [] } }],
  entryCriteria: { op: 'startsWith', field: 'first_name', value: 'QA LR1112 bp' } };
const c = await api('POST', '/modules/' + mid + '/blueprints', { definition: def, isActive: true }); out.create = SR(c).slice(0, 500); const id = c.j && c.j.data && c.j.data.id; if (!id) return out; I.bp = id; SAVE(); LED('blueprint ' + id);
const p = await api('POST', '/modules/' + mid + '/blueprints/' + id + '/publish'); out.publish = SR(p).slice(0, 300);
const r = await mkRec(mid, { first_name: 'QA LR1112 bp rec', qa_lr_type: 'Question' }, I.layout); out.rec = r.s + ' ' + r.id + ' ' + r.err; I.bpRec = r.id; SAVE(); LED('record bp ' + r.id);
await sleep(3000); const st = await api('GET', '/modules/' + mid + '/records/' + r.id + '/blueprint-state'); out.state = SR(st).slice(0, 80) + ' ' + JSON.stringify(st.j && st.j.data).slice(0, 400);
return out;
