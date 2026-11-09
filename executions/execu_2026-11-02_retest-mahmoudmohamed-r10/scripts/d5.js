// NDC-2219 + NDC-2232 (Anyware): U3 temporarily CRM Admin (CRM) + Desk Agent (Desk) and agent of "QA WF Dept R"; restored at the end.
const out = {}; const DM = 'ee386e8d-6d19-4cc0-94b0-100661f513dd', DEPT = '9a7e391c-be72-49e4-a1cf-763e5c88e23d', DA = '44444444-4444-4444-4444-444444444402';
const short = r => r.s + ' ' + (r.s > 299 ? (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || r.t).slice(0, 140) : '');
ledger(`user U3 yibih11717 (${T.U3}) temporarily CRM Admin + Desk Agent and agent of QA WF Dept R — restore to User @ agent x, remove Desk Agent, remove from dept`);
out.setCrmAdmin = short(await api('o', 'POST', `/iam/users/${T.U3}/profiles`, { profile_id: T.P_ADMIN, scope_id: T.OU_AGENTX, replace: true }));
out.addDeskAgent = short(await api('o', 'POST', `/iam/users/${T.U3}/profiles`, { profile_id: DA, scope_id: T.OU_AGENTX, replace: false }));
const dep = (await api('o', 'GET', `desk:/desk/departments/${DEPT}`)).j?.data; const body = { name: dep.name, description: dep.description, visibility: dep.visibility, routing_strategy: dep.routing_strategy, is_active: dep.is_active, agent_user_ids: [...(dep.agent_user_ids || []), T.U3] };
out.addToDept = short(await api('o', 'PATCH', `desk:/desk/departments/${DEPT}`, body));
await sleep(5000);
out.u3profiles = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(x => x.userId === T.U3)?.profileNames;
// 2219
const pd = await api('u3', 'GET', 'desk:/iam/me/permissions'); const keys = JSON.stringify(pd.j?.data || pd.t);
out['2219_desk_perms'] = { s: pd.s, modulesManage: keys.includes('metadata.modules.manage'), fieldsManagePerm: keys.includes('metadata.fields.manage_permissions'), capabilities: keys.includes('metadata.capabilities.manage'), viewsManage: keys.includes('metadata.views.manage'), recordsAccess: keys.includes('metadata.records.access'), sample: keys.slice(0, 300) };
const pc = await api('u3', 'GET', '/iam/me/permissions'); out['2219_crm_has_modules_manage'] = JSON.stringify(pc.j?.data || '').includes('metadata.modules.manage');
out['2219_desk_create_module'] = short(await api('u3', 'POST', 'desk:/teamspaces/d1cacab7-85d4-476f-88f0-1cc6e6788946/modules', { moduleKey: 'qa_rt_r10_agent', labels: { en: 'QA RT r10 agent mod' }, pluralForm: 'QA RT r10 agent mod', singularForm: 'x' }));
// 2232: records visible to the agent (member of QA WF Dept R only) vs owner
const other = arr((await api('o', 'GET', 'desk:/desk/departments')).j?.data).find(d => d.id !== DEPT); const dl = arr((await api('o', 'GET', `desk:/modules/${DM}/layouts`)).j?.data)[0]?.id;
out.otherDeptRec = short(await api('o', 'POST', `desk:/modules/${DM}/records`, { layout_id: dl, department_id: other.id, data: [{ field: 'name', value: { kind: 'string', value: 'QA RT r10 2232 other dept ' + other.name } }] }));
const list = async w => arr((await api(w, 'GET', `desk:/modules/${DM}/records`)).j?.data).map(r => (r.data || []).find(f => f.field === 'name')?.value?.value);
out['2232_owner_sees'] = await list('o'); out['2232_agent_sees'] = await list('u3');
return out;
