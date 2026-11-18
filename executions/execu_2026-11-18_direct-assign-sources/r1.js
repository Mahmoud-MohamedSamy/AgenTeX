const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/ids3.json';
const DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DT2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const ids = {};
ids.prefsBefore = (await api('GET', '/desk/departments/' + DB + '/round-robin-preferences')).j?.data; log({ prefs: ids.prefsBefore });
fs.writeFileSync(OUT, JSON.stringify(ids, null, 1));
const wf = await api('POST', '/workflow/rules', { moduleId: T, departmentIds: [DB], name: 'QA RT22 WF owner on create', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' },
  criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA RT22 WF', caseInsensitive: false },
  actions: [{ order: 0, delaySeconds: 0, type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: DT2 }] });
ids.wf = wf.j?.data?.id; log({ wf: wf.s, t: wf.s >= 300 ? wf.t.slice(0, 300) : undefined });
const rr = await api('POST', '/desk/assignment-rules', { type: 'round_robin', department_id: DB, name: 'QA RT22 RR on create', description: 'QA', is_active: true, execute_on: ['create'],
  targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA RT22 RR' }], pattern: '1' }, method: 'sequential', pool: { kind: 'agents', user_ids: [TU1], team_id: null, excluded_user_ids: [] } }] });
ids.rr = rr.j?.data?.id; log({ rr: rr.s, t: rr.s >= 300 ? rr.t.slice(0, 300) : undefined });
fs.writeFileSync(OUT, JSON.stringify(ids, null, 1));
