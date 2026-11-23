const g = async p => { const r = await api('GET', p); return { s: r.s, d: r.j && r.j.data !== undefined ? r.j.data : null, t: r.t }; };
const out = {};
const dep2 = (await g('/desk/departments/' + DEPT2)).d;
out.agents2 = dep2.agent_user_ids;
const us = [];
for (const id of dep2.agent_user_ids) { const u = (await g('/iam/users/' + id)).d; us.push({ id, name: u && (u.displayName || u.fullName || u.name || u.email), status: u && u.status }); }
out.agentNames = us;
const tk = (await g('/workflow/executions?ruleId=' + '8fe1e5bc-41d1-46e3-8be1-36667bb38502')).d; // TRC rule
const anyTicket = '45795700-7b4c-4787-976a-ade0c8040b3f';
const t = await getTicket(anyTicket); out.ticketSample = { contact_id: t.contact_id, account_id: t.account_id, owner: t.owner, created_by: t.created_by, tags: t.tags, skills: t.skills, team: t.team, layout: t.layout_id };
const C = '43004ce2-577f-4eda-b00a-0750fe40c3d4', A = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const cl = await api('POST', `/modules/${C}/records/search`, { take: 5 }); out.contactSearch = cl.s;
out.contactFields = arr((await g(`/modules/${C}/fields`)).d).map(f => f.fieldName + ':' + f.datatypeKey).join(' ').slice(0, 900);
out.accountFields = arr((await g(`/modules/${A}/fields`)).d).map(f => f.fieldName + ':' + f.datatypeKey).join(' ').slice(0, 600);
out.tags2 = arr((await g('/desk/tags?department_id=' + DEPT2)).d).map(o => ({ id: o.id, name: o.name })).slice(0, 10);
out.skills2 = arr((await g('/desk/skills?department_id=' + DEPT2)).d).map(o => ({ id: o.id, name: o.name })).slice(0, 10);
const ca = arr((await g('/workflow/custom-actions')).d).find(x => x.name === 'QA RT18 CA echo'); out.ca = ca && { id: ca.id, status: ca.status, apps: ca.targetApps, inputs: (ca.inputBindings || []).map(b => b.name + ':' + b.handling) };
const tpl = await g('/desk/email-templates'); out.tpl = tpl.s + ' ' + arr(tpl.d).filter(x => !x.is_system).map(x => x.id + ' ' + x.name + ' ' + x.notification_type).slice(0, 8).join(' | ');
out.teams2 = arr((await g('/desk/teams')).d).filter(x => x.department_id === DEPT2 || x.department_id === DEPT).map(x => ({ id: x.id, name: x.name, dept: x.department_id, members: x.member_user_ids }));
fs.writeFileSync(RUN + '/out/disc2.json', JSON.stringify(out, null, 1));
return out;
