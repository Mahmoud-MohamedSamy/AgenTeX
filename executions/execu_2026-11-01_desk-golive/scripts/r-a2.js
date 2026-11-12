const o = {}; const BASE = 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9', EMAIL = '9804a4f1-b4d3-4b76-8638-3837001ceedc';
const d = await api('GET', '/desk/departments/' + DQ); o.bAgent = (d.j.data.agent_user_ids || []).includes(UB); o.bViewOnly = (d.j.data.view_only_agent_user_ids || []).includes(UB);
for (const [k, id] of [['base', BASE], ['email', EMAIL]]) o['assign ' + k] = sh(await api('POST', `/desk/tickets/${id}/assign`, { owner_id: UB }));
await sleep(2000);
o.mention2 = sh(await api('POST', `/desk/tickets/${BASE}/comments`, { body_html: `<p>QA GL W2 r mention 2 <span data-type="mention" data-id="${UB}" data-label="mahmoud.mahamed1515">@mahmoud.mahamed1515</span> after assign</p>`, is_public: false, mentioned_user_ids: [UB] }));
const ta = await api('GET', '/desk/settings/ticket-access'); o.ticketAccess = ta.s + ' ' + ta.t.slice(0, 300);
return fin(o);
