// NDC-2754: publish "QA RT12 2754 full" in Dept A with strict mode (all), dynamic owners, button order, field check, approval, share, rating trigger (Bad)
const o = {}; const P = 'QA RT12 2754F';
const def = X.bp('2754 full', { marker: P }).state('Open', { onRatingTransitionId: 'rate', onRatingValues: ['bad'] }).state('Escalated').state('On Hold').terminal('Closed')
  .tr('alt', 'Open', 'Closed', {}, { messages: [], deskItems: [{ kind: 'share', mandatory: true }], itemOrder: ['desk:share'], requiredFields: [], fieldValidations: [], instructionalMessage: null })
  .tr('go', 'Open', 'Escalated', {}, { messages: [], deskItems: [], itemOrder: ['field:qa_ndc_amount'], requiredFields: [{ name: 'qa_ndc_amount', datatype: { key: 'currency' }, required: true }], fieldValidations: [{ rule: { op: 'gt', field: 'qa_ndc_amount', value: 0 }, field: 'qa_ndc_amount', message: 'Amount must be more than 0' }], instructionalMessage: null })
  .tr('hold', 'Open', 'On Hold', {}, { messages: [], deskItems: [{ kind: 'approval', mandatory: true }], itemOrder: ['desk:approval'], requiredFields: [], fieldValidations: [], instructionalMessage: null })
  .tr('rate', 'Open', 'On Hold').tr('end', 'Escalated', 'Closed').tr('back', 'On Hold', 'Open').build();
def.strictMode = { scope: 'all', fields: [], actions: [] }; def.dynamicOwners = true;
const b = await X.createBp(def, true); o.create = X.err(b) + ' ' + (b.s >= 400 ? b.t.slice(0, 600) : ''); o.id = b.j?.data?.id;
const g = await api('o', 'GET', `desk:/modules/${X.TK}/blueprints/${o.id}`); const d = g.j?.data?.definition || {};
o.saved = { active: g.j?.data?.isActive, strict: d.strictMode, dyn: d.dynamicOwners, order: (d.transitions || []).map(t => t.id).join(','), rating: JSON.stringify(d.states?.find(s => s.id === 'Open')), goVal: JSON.stringify(d.transitions?.find(t => t.id === 'go')?.during?.fieldValidations) };
return o;
