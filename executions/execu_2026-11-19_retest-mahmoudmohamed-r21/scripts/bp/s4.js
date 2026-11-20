const DD = 'e04e88df-03e2-4a9f-8ccc-ff934cca500e'; const o = {};
let r = await api('PATCH', '/desk/departments/' + DD, { view_only_agent_user_ids: [AG_A] }); o.patch = E(r);
if (r.s >= 300) { r = await api('PUT', '/desk/departments/' + DD, { name: 'QA RT20 BP Dept', agent_user_ids: [OWNER, AG_A], view_only_agent_user_ids: [AG_A] }); o.put = E(r); }
const g = (await api('GET', '/desk/departments/' + DD)).j?.data; o.agents = g.agent_user_ids; o.vo = g.view_only_agent_user_ids;
if ((o.vo || []).includes(AG_A)) LED('CES2 (9d182dfa) set VIEW-ONLY in QA RT20 BP Dept e04e88df (restore: remove view-only at end)');
const bp = await getBp('f2b2c1f5-56fd-4098-91e8-8a8704f78898'); o.ownerIssues = bp.ownerIssues; o.noActive = bp.transitionsWithoutActiveOwner;
const t1 = '25312cc0-7c5b-41a2-89d5-4a78c5155ab8', t2 = '7ba77b0d-9a39-4448-b532-2a391ffc5ceb';
o.ownerTransT1 = await trans(t1); o.ownerTransT2 = await trans(t2);
const tk = await api('GET', '/desk/tickets/' + t1); o.tkKeys = Object.keys(tk.j?.data || {}).filter(k => /num/i.test(k)); o.n1 = tk.j?.data?.ticket_number ?? tk.j?.data?.ticketNumber;
return o;
