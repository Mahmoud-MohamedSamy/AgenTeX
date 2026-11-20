const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const B = '3445ec4a-020e-4f12-b156-dd2de7610164', MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', S = 'QA NDC Distributor';
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const o = { statusesBefore: (await api('GET', '/desk/ticket-statuses')).j?.data?.statuses };
fs.writeFileSync(OUT + 'statuses-before-typechange.json', JSON.stringify(o.statusesBefore, null, 1));
const p = await api('POST', '/desk/sla/policies', { department_id: CS, name: 'QA ST SLA policy 2', description: null, is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false,
  targets: [{ name: 'QA ST 4h', criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA ST TC' }], pattern: null }, response: { value: 1, unit: 'hours' }, resolution: { value: 4, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
o.sla = p.j?.data?.id;
o.t = {};
for (const [k, dep, own] of [['M1', MK, B], ['M2', MK, B], ['C1', CS, null]]) { const c = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA ST TC ' + k, description: 'QA ST type change', department: dep, status: 'Open', priority: 'medium', owner: own }) }); o.t[k] = c.j?.data?.id; }
await sleep(12000);
for (const id of Object.values(o.t)) await api('PATCH', '/modules/' + TK + '/records/' + id, { data: fields({ status: S }) });
fs.writeFileSync(OUT + 'tc.json', JSON.stringify(o, null, 1)); log({ sla: p.s, tickets: o.t });
