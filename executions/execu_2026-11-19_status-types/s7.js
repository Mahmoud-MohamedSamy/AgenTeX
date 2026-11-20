const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const B = '3445ec4a-020e-4f12-b156-dd2de7610164', MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const o = {};
for (const x of JSON.parse(fs.readFileSync(OUT + 'orphans.json', 'utf8'))) o['orphanDel_' + x.id.slice(0, 6)] = (await api('DELETE', '/modules/' + TK + '/records/' + x.id)).s;
// workload walk
const wl = async () => (((await api('GET', '/desk/agents/' + B + '/workload')).j?.data?.departments || []).find(d => d.department_id === MK) || {}).open_tickets;
const c = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA ST WL walk', description: 'QA ST', department: MK, status: 'Open', priority: 'medium', owner: B }) }); o.wlTicket = c.j?.data?.id;
await sleep(8000); o.wl = [['created Open', await wl()]];
for (const s of ['QA NDC Pending', 'On Hold', 'Escalated', 'Closed', 'Open']) { const p = await api('PATCH', '/modules/' + TK + '/records/' + o.wlTicket, { data: fields({ status: s }) }); await sleep(10000); const t = (await api('GET', '/desk/tickets/' + o.wlTicket)).j?.data || {}; o.wl.push([s + ' (patch ' + p.s + ', desk=' + t.status + ', closed_at=' + (t.closed_at ? 'set' : '-') + ')', await wl()]); }
// SLA setup in Customer Support
const p = await api('POST', '/desk/sla/policies', { department_id: CS, name: 'QA ST SLA policy', description: null, is_active: true, triggers: { create: true, update: true, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false,
  targets: [{ name: 'QA ST 4h', criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA ST SLA' }], pattern: null }, response: { value: 1, unit: 'hours' }, resolution: { value: 4, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
o.sla = p.j?.data?.id; o.slaCreate = p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 200) : '');
o.slaT = {};
for (const s of ['Escalated', 'On Hold', 'QA NDC Pending']) { const t = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA ST SLA ' + s, description: 'QA ST', department: CS, status: 'Open', priority: 'medium', owner: null }) }); o.slaT[s] = t.j?.data?.id; }
await sleep(15000);
const slaOf = async id => { const s = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data; return s ? { state: s.state, note: s.note, target: JSON.stringify(s.target || s.obligations || '').slice(0, 300) } : null; };
o.slaBefore = {}; for (const [s, id] of Object.entries(o.slaT)) o.slaBefore[s] = await slaOf(id);
for (const [s, id] of Object.entries(o.slaT)) o['move_' + s] = (await api('PATCH', '/modules/' + TK + '/records/' + id, { data: fields({ status: s }) })).s;
o.movedAt = new Date().toISOString(); await sleep(15000);
o.slaAfterMove = {}; for (const [s, id] of Object.entries(o.slaT)) o.slaAfterMove[s] = await slaOf(id);
fs.writeFileSync(OUT + 'step7.json', JSON.stringify(o, null, 1)); log(o);
