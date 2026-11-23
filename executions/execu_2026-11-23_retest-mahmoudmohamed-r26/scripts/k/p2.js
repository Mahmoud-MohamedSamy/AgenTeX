let r = await api('POST', '/desk/departments', { name: 'QA RT26 VO Dept', description: 'QA RT26 retest - safe to delete', agent_user_ids: [OWNER, AG_A], view_only_agent_user_ids: [AG_A] });
log('create', E(r), r.j?.data?.id); const DD = r.j?.data?.id; if (!DD) return;
made.other.push({ dept: DD }); keep(); LED('department QA RT26 VO Dept created ' + DD + ' (owner + CES2 view-only)');
let g = (await api('GET', '/desk/departments/' + DD)).j?.data; log('vo', g.view_only_agent_user_ids, 'agents', g.agent_user_ids);
if (!g.view_only_agent_user_ids?.includes(AG_A)) { r = await api('PATCH', '/desk/departments/' + DD, { name: 'QA RT26 VO Dept', agent_user_ids: [OWNER, AG_A], view_only_agent_user_ids: [AG_A] }); log('patch', E(r)); }
const t1 = await mkT('vo', 'T1 open', {}, DD); const t2 = await mkT('vo', 'T2 closed', {}, DD);
r = await api('PATCH', `/modules/${TK}/records/${t2}`, { data: fields({ status: 'Closed' }) }); log('close t2', E(r));
fs.writeFileSync(RUN + '/scripts/k/vo.json', JSON.stringify({ DD, t1, t2 }));
for (const t of [t1, t2]) { const x = (await api('GET', '/desk/tickets/' + t)).j?.data; log(x?.ticket_number, x?.status, x?.department_id); }
