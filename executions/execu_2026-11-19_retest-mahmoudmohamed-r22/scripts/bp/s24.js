const DD = 'e04e88df-03e2-4a9f-8ccc-ff934cca500e';
const r = await api('PATCH', '/desk/departments/' + DD, { name: 'QA RT20 BP Dept', agent_user_ids: [OWNER], view_only_agent_user_ids: [] });
const g = (await api('GET', '/desk/departments/' + DD)).j?.data; LED('CES2 removed from QA RT20 BP Dept (restore agent memberships): ' + r.s + ' agents=' + g.agent_user_ids.length);
return { s: E(r), agents: g.agent_user_ids };
