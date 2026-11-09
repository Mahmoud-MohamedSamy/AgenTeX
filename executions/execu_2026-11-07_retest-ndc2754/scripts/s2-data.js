const o = {}; const P = 'QA RT13 2754F'; const A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537'; const A = X.ids.DEPT_A;
const def = X.bp('2754 full', { marker: P }).state('Open', { onRatingTransitionId: 'rate', onRatingValues: ['bad'] }).state('Escalated').state('On Hold').terminal('Closed')
  .tr('alt', 'Open', 'Closed', {}, { messages: [], deskItems: [{ kind: 'share', mandatory: true }], itemOrder: ['desk:share'], requiredFields: [], fieldValidations: [], instructionalMessage: null })
  .tr('go', 'Open', 'Escalated', {}, { messages: [], deskItems: [], itemOrder: ['field:qa_ndc_amount'], requiredFields: [{ name: 'qa_ndc_amount', datatype: { key: 'currency' }, required: true }], fieldValidations: [{ rule: { op: 'gt', field: 'qa_ndc_amount', value: 0 }, field: 'qa_ndc_amount', message: 'Amount must be more than 0' }], instructionalMessage: null })
  .tr('hold', 'Open', 'On Hold', {}, { messages: [], deskItems: [{ kind: 'approval', mandatory: true }], itemOrder: ['desk:approval'], requiredFields: [], fieldValidations: [], instructionalMessage: null })
  .tr('rate', 'Open', 'On Hold').tr('end', 'Escalated', 'Closed').tr('back', 'On Hold', 'Open').build();
def.strictMode = { scope: 'all', fields: [], actions: [] }; def.dynamicOwners = true;
const b = await X.createBp(def, true); o.bp = X.err(b) + ' ' + (b.s >= 400 ? b.t.slice(0, 500) : ''); o.bpId = b.j?.data?.id;
const tc = await api('o', 'POST', 'desk:/desk/teams', { name: 'QA RT13 2754 team', description: 'QA retest NDC-2754 7 Nov - safe to delete', department_id: A, sources: [{ kind: 'agent', ref_id: A3 }] }); o.teamId = tc.j?.data?.id || tc.j?.data?.team?.id; o.team = X.err(tc); if (o.teamId) ledger(`team "QA RT13 2754 team" ${o.teamId}`);
o.tk = {}; for (const s of ['t0 baseline', 't1 user owner', 't2 moved on', 't3 team owner', 't4 agent share', 't5 own dept', 't6 deptB', 't7 check', 't8 approval', 't9 strict', 't10 revoke']) o.tk[s.split(' ')[0]] = (await X.ticket(P + ' ' + s)).j?.data?.id;
await sleep(8000); o.states = {}; for (const [k, id] of Object.entries(o.tk)) { const s = await X.state(id); o.states[k] = s ? (s.activeStates || []).join(',') : 'none'; }
require('fs').writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/data.json', JSON.stringify(o, null, 1));
return o;
