// B-06 follow-up (20 Nov): does an assignment rule with "SLA Escalated = true" pick up an escalated ticket?
const o = {}; const c = (f, op, v) => ({ field_key: f, operator: op, value: v }); const D = IDS.DA;
const dep = (await api('GET', '/desk/departments/' + D)).j.data; o.members = dep.agent_user_ids.map(nmU);
const before = await prefsG(D); fs.writeFileSync(RUN + '/out/prefsDA-esc-before.json', JSON.stringify(before)); o.prefsBefore = before;
o.prefOffline = await prefsS(D, { assign_to_offline_agents: true }); LED('ESC: Dept A prefs assign_to_offline_agents -> true (restore from out/prefsDA-esc-before.json)');
const pname = 'QA AR ESC SLA';
const p = await api('POST', '/desk/sla/policies', { department_id: D, name: pname, description: 'QA AR', is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true,
  targets: [{ name: 't', criteria: { conditions: [c('subject', 'starts_with', 'QA AR ESC Y')], pattern: '1' }, response: { value: 1, unit: 'minutes' }, resolution: { value: 600, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false,
    escalations: { response: [{ level: 1, timing: 'at', offset: null, recipients: [], template_ref: null, actions: { assign_owner: null, assign_team: null, set_priority: null } }], resolution: [] } }] });
o.sla = p.s + ' ' + (E(p) || ''); const pid = p.j && p.j.data && p.j.data.id; if (pid) { LED('SLA policy "' + pname + '" ' + pid + ' (Dept A, delete)'); IDS.ESC_SLA = pid; }
const r = await mkRule({ type: 'round_robin', department_id: D, name: 'QA AR ESC rule', description: 'QA', is_active: true, execute_on: ['create', 'update'], targets: [{ criteria: { conditions: [c('subject', 'starts_with', 'QA AR ESC'), c('sla_escalated', 'equals', true)], pattern: '1 and 2' }, method: 'sequential', pool: { kind: 'agents', user_ids: [IDS.A1], team_id: null, excluded_user_ids: [] } }] });
o.rule = r.s + ' ' + (r.e || ''); IDS.ESC_RULE = r.id;
const y = await mk('ESC_Y', 'QA AR ESC Y 1', D), n = await mk('ESC_N', 'QA AR ESC N 1', D); o.tickets = [y.id, n.id];
await sleep(8000); o.ownerOnCreate = { y: await ownN(y.id), n: await ownN(n.id) };
const sl = (await api('GET', '/desk/tickets/' + y.id + '/sla')).j; o.slaY0 = sl && sl.data; saveIds();
return o;
