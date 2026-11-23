const r = await api('POST', '/desk/departments', { name: 'QA RT20 BP Dept', description: 'QA RT20 BP retest - NDC-3065 view-only owner', agent_user_ids: [OWNER, AG_A] });
const id = r.j?.data?.id; if (id) { made.other.push({ dept: id }); keep(); LED('department created ' + id + ' "QA RT20 BP Dept" agents owner+CES2 (' + r.s + ')'); }
const g = id ? (await api('GET', '/desk/departments/' + id)).j?.data : null;
return { s: E(r), id, agents: g && g.agent_user_ids, vo: g && g.view_only_agent_user_ids };
