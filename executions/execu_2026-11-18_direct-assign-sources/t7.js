const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/ids2.json';
const O = '97be04b6-0a08-4883-aa51-e1650b11cab7'; const ids = {};
const n0 = (await api('GET', '/desk/assignment/notification-settings')).j?.data; ids.notifBefore = n0;
log({ switchOn: (await api('PUT', '/desk/assignment/notification-settings', { ...n0, direct_rules_enabled: true })).s });
const r = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA RT22 DA email+webform', description: 'QA: email and web form sources', is_active: true, execute_on: ['create'],
  targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA RT22 DA' }], pattern: '1' }, coming_to_department_id: null, move_to_department_id: null, assign: { kind: 'agent', user_id: O, team_id: null } }] });
ids.rule = r.j?.data?.id; log({ rule: r.s, t: r.s >= 300 ? r.t.slice(0, 300) : undefined });
fs.writeFileSync(OUT, JSON.stringify(ids, null, 1));
