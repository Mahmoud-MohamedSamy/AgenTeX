const cs = D((await api('GET', '/desk/departments/' + DEP.CS)).j); out.orig = cs.agent_user_ids.length + '/' + cs.view_only_agent_user_ids.length;
out.put = await prr('PUT', '/desk/departments/' + DEP.CS + '/agents', { agent_user_ids: [...cs.agent_user_ids, US.D], view_only_agent_user_ids: [...cs.view_only_agent_user_ids, US.D] });
const r = await mk(TM, 'ticket', 'QA AC2 R7', { subject: 'QA AC2 R7', department: DEP.CS, status: 'Open', email: 'qa-ac2-c@example.com', channel: 'phone', description: 'QA AC2 view-only test' }); out.r7 = r.id;
out.un = await prr('POST', '/desk/tickets/' + r.id + '/assign', { owner_id: null });
return fin({ out });
