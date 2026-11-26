const t = ST.tickets['QA PA T01']; const o = {};
const r1 = await api.A('POST', `/desk/tickets/${t}/approvals`, { subject: 'QA PA T01 request', description: 'QA PA please approve T01', approver_user_ids: [U.B] }); o.req = E(r1) + ' ' + r1.t.slice(0, 2500);
await sleep(2000);
const ib = await inbox('B'); o.inboxB = ib.d?.counts; o.item = JSON.stringify(ib.d?.approvals?.[0]).slice(0, 2500);
return o;
