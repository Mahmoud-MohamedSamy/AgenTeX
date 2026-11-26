const o = {}; const D1 = 'a373cfd1-85e8-495d-af9a-1a003d2a08a3';
const p = await api.O('POST', '/desk/sla/policies', { department_id: D1, name: 'QA RT27 SLA', description: null, is_active: true, triggers: { create: true, update: true, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false,
  targets: [{ name: 'QA RT27 target', criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA RT27 sla' }], pattern: null }, response: { value: 1, unit: 'hours' }, resolution: { value: 4, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
o.policy = E(p); ST.SLA = p.j?.data?.id; saveState(); if (ST.SLA) ledger('sla policy QA RT27 SLA ' + ST.SLA);
await sleep(3000);
const t = await mkTicket('O', 'QA RT27 sla A', { department: D1 }); ST.TSLA = [t.id]; saveState();
for (let i = 0; i < 8; i++) { await sleep(8000); const s = await api.O('GET', `/desk/tickets/${t.id}/sla`); o['sla_' + (i + 1) * 8 + 's'] = s.s + ' ' + s.t.slice(0, 300); if (/"state":"(running|active|paused|met|breached)"/i.test(s.t) || /response_due|due_at/.test(s.t)) break; }
return o;
