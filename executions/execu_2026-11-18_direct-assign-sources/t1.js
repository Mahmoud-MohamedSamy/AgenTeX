const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/ids.json';
const DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b', T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const ids = {};
const n0 = (await api('GET', '/desk/assignment/notification-settings')).j?.data; ids.notifBefore = n0;
const s = await api('PUT', '/desk/assignment/notification-settings', { ...n0, direct_rules_enabled: true }); log({ switchOn: s.s, t: s.s >= 300 ? s.t.slice(0, 200) : undefined });
const r = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA RT22 DA sources', description: 'QA: which ticket sources trigger direct assignment', is_active: true, execute_on: ['create'],
  targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA RT22 DA' }], pattern: '1' }, coming_to_department_id: DB, move_to_department_id: null, assign: { kind: 'agent', user_id: TU1, team_id: null } }] });
ids.rule = r.j?.data?.id; log({ rule: r.s, id: ids.rule, t: r.s >= 300 ? r.t.slice(0, 300) : undefined });
fs.writeFileSync(OUT, JSON.stringify(ids, null, 1));
await sleep(3000);
const c = await api('POST', '/modules/' + T + '/records', { data: fields({ subject: 'QA RT22 DA manual create (API)', description: 'QA RT22 DA', department: DB, status: 'Open', priority: 'medium', owner: null }) });
ids.manual = c.j?.data?.id; log({ create: c.s }); fs.writeFileSync(OUT, JSON.stringify(ids, null, 1));
await sleep(15000);
const d = (await api('GET', '/modules/' + T + '/records/' + ids.manual)).j?.data?.data || []; const o = {}; for (const x of d) o[x.field] = x.value?.value;
const ex = (await api('GET', '/workflow/executions?recordId=' + ids.manual)).j?.data || [];
log({ manual: { n: o.ticket_number, owner: o.owner, tu1: o.owner === TU1 }, executions: (Array.isArray(ex) ? ex : []).map(e => ({ rule: e.ruleId?.slice(0, 8), origin: e.originName, outcome: e.outcome || e.status, det: JSON.stringify(e.details || '').slice(0, 120) })) });
