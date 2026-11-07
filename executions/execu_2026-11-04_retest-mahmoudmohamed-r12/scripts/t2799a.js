const o = {}; const P = 'QA RT12 2799';
const def = X.bp('2799 bp', { marker: P }).state('Open', { slaMinutes: 4, slaPreExpiryMinutes: 2 }).state('Escalated').terminal('Closed')
  .tr('go', 'Open', 'Escalated', {}, { messages: [], deskItems: [], itemOrder: ['field:qa_ndc_amount'], requiredFields: [{ name: 'qa_ndc_amount', datatype: { key: 'currency' }, required: true }], fieldValidations: [], instructionalMessage: null })
  .tr('end', 'Escalated', 'Closed').build();
def.states[0].slaClock = 'calendar';
const b = await X.createBp(def, false); o.create = X.err(b) + ' ' + (b.s >= 400 ? b.t.slice(0, 400) : ''); o.id = b.j?.data?.id;
return o;
