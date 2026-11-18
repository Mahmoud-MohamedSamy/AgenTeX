const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/ids2.json';
const ids = JSON.parse(fs.readFileSync(OUT, 'utf8')); const O = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const tg = d => ({ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA RT22 DA' }], pattern: '1' }, coming_to_department_id: d, move_to_department_id: null, assign: { kind: 'agent', user_id: O, team_id: null } });
const r = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA RT22 DA email+webform', description: 'QA: email and web form sources', is_active: true, execute_on: ['create'],
  targets: [tg('8c6073ac-ba5f-4d17-9960-71a6850662a9'), tg('7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'), tg('4853562a-0b4d-45cb-ba34-9f2118fcd32c')] });
ids.rule = r.j?.data?.id; log({ rule: r.s, t: r.s >= 300 ? r.t.slice(0, 300) : undefined }); fs.writeFileSync(OUT, JSON.stringify(ids, null, 1));
