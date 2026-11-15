const mid = await modId(); const L = I.layout; const o = {};
const def = { name: P + ' VR BP', description: 'qa', layoutId: L, moduleKey: 'leads', targetField: 'qa_rt18v_pick', continuous: false, entryCriteria: null,
  states: [{ id: 'Open', name: 'Open', position: { x: 80, y: 80 }, isTerminal: false }, { id: 'Reject', name: 'Reject', position: { x: 340, y: 80 }, isTerminal: false }, { id: 'Done', name: 'Done', position: { x: 600, y: 80 }, isTerminal: true }],
  transitions: [{ id: 't_qa_1', name: 'QA to Reject', fromStateId: 'Open', toStateId: 'Reject', color: '#2563eb', before: { visibilityCriteria: null }, during: { tags: [], checklist: [], requireNote: false, requiredFields: [{ name: 'qa_rt18v_text', required: true, datatype: { key: 'single_line' } }], fieldValidations: [], requireAttachment: false, instructionalMessage: 'qa' }, after: { actions: [] } },
    { id: 't_qa_2', name: 'QA to Done', fromStateId: 'Reject', toStateId: 'Done', color: '#2563eb', before: { visibilityCriteria: null }, during: { tags: [], checklist: [], requireNote: false, requiredFields: [], fieldValidations: [], requireAttachment: false, instructionalMessage: null }, after: { actions: [] } }] };
if (!I.bp) { const c = await api('POST', '/modules/' + mid + '/blueprints', { definition: def, ...def }); o.create = SR(c).slice(0, 300); if (!(c.j && c.j.data)) return o; I.bp = c.j.data.id; SAVE(); LED('blueprint "QA RT18 VR BP" ' + I.bp + ' (Leads)');
  const p = await api('POST', '/modules/' + mid + '/blueprints/' + I.bp + '/publish', {}); o.publish = SR(p).slice(0, 200); }
o.active = (await api('GET', '/modules/' + mid + '/blueprints/' + I.bp)).j.data.isActive;
const rec = await mkRec(mid, { first_name: 'QA', last_name: P + ' G14 ui', qa_rt18v_pick: 'Open', qa_rt18v_note: 'n' }, L); o.rec = rec.s + ' ' + rec.id + ' ' + rec.err; I.bpRec = rec.id;
const rec2 = await mkRec(mid, { first_name: 'QA', last_name: P + ' G14 api', qa_rt18v_pick: 'Open', qa_rt18v_note: 'n' }, L); I.bpRec2 = rec2.id; SAVE();
await sleep(2000);
const tr = await api('GET', '/modules/' + mid + '/records/' + rec2.id + '/blueprint-transitions'); o.trs = JSON.stringify(tr.j && tr.j.data).slice(0, 200);
const a = await api('POST', '/modules/' + mid + '/records/' + rec2.id + '/blueprint-transitions/t_qa_1', { qa_rt18v_text: 'BAD-api' }); o.apiBad = SR(a).slice(0, 400);
o.after = await recVals(mid, rec2.id); o.after = { text: o.after.qa_rt18v_text, pick: o.after.qa_rt18v_pick };
return o;
