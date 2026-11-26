const t = ST.tickets['QA PA T01']; const o = {};
const r0 = await api.A('POST', `/desk/tickets/${t}/approvals`, {}); o.empty = E(r0);
const r1 = await api.A('POST', `/desk/tickets/${t}/approvals`, { subject: 'QA PA T01 request', description: 'QA PA please approve T01', approver_ids: [U.B] }); o.req = E(r1) + ' ' + r1.t.slice(0, 1500);
return o;
