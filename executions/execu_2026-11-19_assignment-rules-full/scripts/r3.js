const L = []; const c = (f, o, v) => ({ field_key: f, operator: o, value: v }); const pname = 'QA AR SLA 3046';
const p = await api('POST', '/desk/sla/policies', { department_id: IDS.DB, name: pname, description: 'QA AR', is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true,
  targets: [{ name: 't', criteria: { conditions: [c('subject', 'starts_with', 'QA AR SLA')], pattern: '1' }, response: { value: 60, unit: 'minutes' }, resolution: { value: 600, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
const pid = p.j && p.j.data && p.j.data.id; if (pid) LED('SLA policy "' + pname + '" ' + pid + ' (Dept B, delete)');
L.push({ policy: p.s, e: E(p) });
const ra = await mkRule({ type: 'round_robin', department_id: IDS.DB, name: 'QA AR R3046 sla name', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [c('subject', 'starts_with', 'QA AR SLA N'), c('sla_name', 'equals', pname)], pattern: '1 and 2' }, method: 'sequential', pool: { kind: 'agents', user_ids: [IDS.A1, IDS.A2], team_id: null, excluded_user_ids: [] } }] });
const rv = await mkRule({ type: 'round_robin', department_id: IDS.DB, name: 'QA AR R3046 sla violated', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [c('subject', 'starts_with', 'QA AR SLA V'), c('sla_violated', 'equals', false)], pattern: '1 and 2' }, method: 'sequential', pool: { kind: 'agents', user_ids: [IDS.A1, IDS.A2], team_id: null, excluded_user_ids: [] } }] });
await sleep(3000);
const tn = await mkTicket('QA AR SLA N 1', IDS.DB); const tv = await mkTicket('QA AR SLA V 1', IDS.DB);
const on = await waitO(tn.id, 30), ov = await waitO(tv.id, 20); const sl = (await api('GET', '/desk/tickets/' + tn.id + '/sla')).j; const sla = sl && sl.data && (sl.data.obligations || []).map(o => o.kind + ':' + o.state);
L.push(R_('R-3046', on.owner ? 'Pass' : 'Fail', 'Regression NDC-3046 (SLA policy "QA AR SLA 3046" in Dept B, SLA ' + JSON.stringify(sla) + '): RR rule "SLA name = policy" on create -> ' + on.owner + ' in ' + on.s + ' s. Extra: rule "SLA Violated = false" -> ' + ov.owner + '; with no SLA policy at all the same condition did not match (ticket left unassigned)'));
for (const r of [ra, rv]) if (r.id) await setActive(r.id, false);
if (pid) { const pol = (await api('GET', '/desk/sla/policies/' + pid)).j.data; await api('PUT', '/desk/sla/policies/' + pid, { ...pol, is_active: false }); }
return L;
