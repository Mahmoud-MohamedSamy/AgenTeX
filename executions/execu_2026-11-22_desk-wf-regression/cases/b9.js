// IN-03 workflow + blueprint (NDC-2730 pattern): status transition by blueprint, workflow on status change sets a field; field must stay.
const out = {}; const uuid = () => globalThis.crypto.randomUUID();
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: {}, after: { actions: [] } });
const def = { name: 'QA WF IN03 bp', description: 'QA workflow regression IN-03 - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: DEPT2,
  entryCriteria: { op: 'contains', field: 'subject', value: 'QA WF IN03 ' }, states: [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], transitions: [tr('esc', 'Open', 'Escalated'), tr('close', 'Escalated', 'Closed')] };
const b = await api('POST', `/modules/${T}/blueprints`, { definition: def, isActive: true }); const BP = b.j?.data?.id; out.bp = b.s + ' ' + (BP || b.t.slice(0, 300)); if (BP) ledger(`blueprint "QA WF IN03 bp" ${BP}`);
if (!BP) return out;
const FCT = f => ({ kind: 'SpecificFieldChanged', fieldName: f, fieldNames: [f], fieldMatch: 'any', alsoOnCreate: false });
const r1 = await mkRule('IN03', FCT('status'), [FU({ qa_ndc_company_name: 'AFTER-${status}', priority: 'high' })]); out.rule = r1.s;
const t = await mkTicket('IN03', { department: DEPT2, priority: 'low' });
let s = null; for (let i = 0; i < 15 && !s; i++) { await sleep(2000); s = ((await api('GET', `/modules/${T}/records/${t.id}/blueprint-state`)).j?.data?.states || [])[0]; }
out.entered = s && s.activeStates;
const run = await api('POST', `/desk/tickets/${t.id}/blueprint-transitions/esc`, { run_id: uuid(), expected_state_id: 'Open', fields: {} }); out.transition = run.s + ' ' + (run.s >= 300 ? run.t.slice(0, 200) : '');
await sleep(20000);
const g1 = await getTicket(t.id); out.after20s = { status: g1.status, priority: g1.priority, company: g1.qa_ndc_company_name };
await sleep(40000);
const g2 = await getTicket(t.id); out.after60s = { status: g2.status, priority: g2.priority, company: g2.qa_ndc_company_name };
out.runs = (await execs(t.id, r1.id)).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.status).join(','));
out.history = arr((await api('GET', `/desk/tickets/${t.id}/history`)).j?.data).slice(0, 12).map(h => h.action + ' ' + (h.field_key || '') + ' ' + (h.old_value || '') + '→' + (h.new_value || '') + ' ' + (h.source || ''));
const del = await api('DELETE', `/modules/${T}/blueprints/${BP}`); out.bpDelete = del.s; if (del.s < 300) ledger('blueprint QA WF IN03 bp deleted');
return out;
