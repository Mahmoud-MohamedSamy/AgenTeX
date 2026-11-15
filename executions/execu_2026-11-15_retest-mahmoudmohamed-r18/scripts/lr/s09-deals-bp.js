const mid = await modId(); const dm = await modId('deals'); const out = {};
let F = await fieldsOf(dm);
if (!F.some(f => f.fieldName === 'qa_rt18_appnote')) { const c = await api('POST', '/modules/' + dm + '/fields', { fields: [{ fieldName: 'qa_rt18_appnote', datatypeKey: 'single_line', labels: { en: P + ' approval note' }, datatypeOptions: {}, required: false, unique: false, uniquePeerModuleIds: [] }] }); out.field = SR(c).slice(0, 200); LED('field qa_rt18_appnote (Deals)'); F = await fieldsOf(dm); }
if (!I.dealLayout) {
  const ls = arr((await api('GET', '/modules/' + dm + '/layouts')).j.data); const std = ls.find(l => l.name === 'Standard') || ls.find(l => l.isDefault); const src = await getLayout(dm, std.id);
  const b = JSON.parse(JSON.stringify(src)); delete b.id; b.name = P + ' Deals'; for (const k of ['displayInHelpCenter','helpCenterDisplayName','helpCenter','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents','rowVersion','createdAt','lastModifiedAt','isDefault','is_default']) delete b[k];
  for (const v of Object.values(b.views)) { const on = new Set(v.layout.sections.flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.fieldName)))); const add = ['stage', 'discount', 'amount', 'qa_rt18_appnote'].filter(n => !on.has(n)); if (add.length) v.layout.sections.unshift({ id: 'sec-qa-rt18-deal', label: { default: P + ' Deal', en: P + ' Deal' }, tab_order: 'left_to_right', columns: [{ id: 'col-sec-qa-rt18-deal', column_order: 1, visibility: { mode: 'ALWAYS', field: null, op: null, value: null, visible: true, conditions: [] }, span: 2, fields: F.filter(f => add.includes(f.fieldName)).map(f => JSON.parse(JSON.stringify(f))) }] }); }
  const c = await api('POST', '/modules/' + dm + '/layouts', b); out.lay = SR(c).slice(0, 300); if (c.j.data) { I.dealLayout = c.j.data.id; SAVE(); LED('layout "QA RT18 Deals" ' + c.j.data.id + ' (Deals)'); }
}
if (!I.dealRule) { const r = await mkRule(dm, { name: P + ' deals', layoutId: I.dealLayout, primaryField: 'stage', branches: [br({ op: 'and', children: [eq('stage', 'negotiation'), { op: 'gt', field: 'discount', value: 20 }] }, [show(['qa_rt18_appnote']), req(['qa_rt18_appnote'])])] }, 'Deals'); out.rule = SR(r).slice(0, 400); if (r.j.data) { I.dealRule = r.j.data.id; SAVE(); } }
if (!I.dealRec) { const rec = await mkRec(dm, { deal_name: P + ' deal G9', stage: 'qualification', discount: 30, amount: 1000 }, I.dealLayout, 'Deals'); out.rec = rec.s + ' ' + rec.id + ' ' + rec.err; if (rec.id) { I.dealRec = rec.id; SAVE(); } }
// direct API check: PATCH stage to negotiation without note
const p = await api('PATCH', '/modules/' + dm + '/records/' + I.dealRec, { data: [{ field: 'stage', value: enc('negotiation') }] }); out.patchNoNote = SR(p).slice(0, 300);
// blueprint for G10
if (!I.bp) {
  const def = { name: P + ' BP', description: '', moduleKey: 'leads', layoutId: I.layout, layoutName: P + ' Layout', targetField: FP + 'type', continuous: false,
    states: [{ id: 'Question', name: 'Question', position: { x: 80, y: 80 }, isTerminal: false }, { id: 'Refund', name: 'Refund', position: { x: 340, y: 80 }, isTerminal: true }],
    transitions: [{ id: 't_qa_rt18_1', name: 'QA to Refund', color: '#2563eb', fromStateId: 'Question', toStateId: 'Refund', before: { visibilityCriteria: null }, during: { tags: [], checklist: [], requireNote: false, requiredFields: [], fieldValidations: [], requireAttachment: false, instructionalMessage: 'QA RT18 transition' }, after: { actions: [] } }],
    entryCriteria: { op: 'startsWith', field: 'first_name', value: 'QA RT18 bp' } };
  const c = await api('POST', '/modules/' + mid + '/blueprints', { definition: def, isActive: true }); out.bp = SR(c).slice(0, 500); const id = c.j && c.j.data && c.j.data.id; if (!id) return out; I.bp = id; SAVE(); LED('blueprint "QA RT18 BP" ' + id + ' (Leads)');
  out.publish = SR(await api('POST', '/modules/' + mid + '/blueprints/' + id + '/publish')).slice(0, 300);
}
if (!I.bpRec) { const r = await mkRec(mid, { first_name: 'QA RT18 bp rec', last_name: 'QA RT18 bp rec', qa_rt18_type: 'Question' }, I.layout); out.bpRec = r.s + ' ' + r.id + ' ' + r.err; I.bpRec = r.id; SAVE(); }
await sleep(3000); const st = await api('GET', '/modules/' + mid + '/records/' + I.bpRec + '/blueprint-state'); out.state = SR(st).slice(0, 80) + ' ' + JSON.stringify(st.j && st.j.data).slice(0, 400);
return out;
