// NDC-1172 setup: QA RT 1172 teamspace whose access list has only test user 1 (admin); me (CRM Admin) not on it.
const U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2';
const c = await api('POST', '/teamspaces', { name: 'QA RT 1172', slug: 'qa_rt_1172_' + Date.now().toString(36), description: 'QA RT 1172 (deleted after the run)' }); const id = c.j?.data?.id;
if (!id) return done({ err: c.t.slice(0, 200) });
const m = await api('PATCH', `/teamspaces/${id}/access-mode`, { access_mode: 'selected' });
const a = await api('PUT', `/teamspaces/${id}/acl`, { rows: [{ principal_kind: 'user', principal_id: U1, permission_key: null, access_level: 'admin' }] });
const f = await api('POST', `/teamspaces/${id}/folders`, { name: 'QA RT 1172 folder' }).catch(() => ({ s: 'x' }));
const mine = { list: arr((await api('GET', '/teamspaces')).j?.data).some(t => t.id === id), open: (await api('GET', `/teamspaces/${id}`)).s, folders: (await api('GET', `/teamspaces/${id}/folders`)).s };
return done({ id, mode: m.s, acl: a.s + ' ' + (a.s >= 300 ? a.t.slice(0, 160) : ''), folderBeforeLockout: f.s, meAfter: mine });
