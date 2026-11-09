// NDC-1701: as a plain member (test user 1), try every admin action on QA RT TS r6.
const id = 'f7082675-ea1b-4220-bfd2-47925ef97570', ME = '3445ec4a-020e-4f12-b156-dd2de7610164', U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2';
const s = r => r.s + ' ' + (r.s >= 300 ? (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || r.t).slice(0, 110) : 'ALLOWED');
const out = {};
const g = await api('GET', `/teamspaces/${id}`); out.open = g.s + ' canManage=' + g.j?.data?.canManage;
out.folder = s(await api('POST', `/teamspaces/${id}/folders`, { name: 'QA RT 1701 member folder' }));
out.accessMode = s(await api('PATCH', `/teamspaces/${id}/access-mode`, { access_mode: 'all' }));
out.acl = s(await api('PUT', `/teamspaces/${id}/acl`, { rows: [{ principal_kind: 'user', principal_id: U1, permission_key: null, access_level: 'admin' }] }));
out.rename = s(await api('PUT', `/teamspaces/${id}`, { name: 'QA RT TS r6 renamed by member' }));
out.createModule = s(await api('POST', `/teamspaces/${id}/modules`, { moduleKey: 'qa_rt_1701_member', labels: { en: 'QA RT 1701 member' }, pluralLabels: { en: 'QA RT 1701 members' }, singularLabels: { en: 'QA RT 1701 member' } }));
const after = (await api('GET', `/teamspaces/${id}`)).j?.data; out.after = { name: after?.name, mode: after?.accessMode, modifiedBy: after?.lastModifiedByName };
return done(out);
