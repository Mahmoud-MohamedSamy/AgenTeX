const DD = 'e04e88df-03e2-4a9f-8ccc-ff934cca500e';
const r = await api('PATCH', '/desk/departments/' + DD, { name: 'QA RT20 BP Dept', agent_user_ids: [OWNER, AG_A], view_only_agent_user_ids: [] });
const g = (await api('GET', '/desk/departments/' + DD)).j?.data; LED('CES2 view-only REMOVED in QA RT20 BP Dept (restore) ' + r.s + ' vo=' + JSON.stringify(g.view_only_agent_user_ids));
return { s: E(r), vo: g.view_only_agent_user_ids, agents: g.agent_user_ids.length };
