// Teamspace setup for 1701: QA teamspace, ACL me=admin, test user 1=access, mode selected.
const ME = '3445ec4a-020e-4f12-b156-dd2de7610164', U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2';
const c = await api('POST', '/teamspaces', { name: 'QA RT TS r6', slug: 'qa_rt_ts_r6_' + Date.now().toString(36), description: 'QA RT r6 teamspace (deleted after the run)' });
const id = c.j?.data?.id; if (!id) return done({ err: c.s + ' ' + c.t.slice(0, 200) });
const acl = await api('PUT', `/teamspaces/${id}/acl`, { rows: [{ principal_kind: 'user', principal_id: ME, permission_key: null, access_level: 'admin' }, { principal_kind: 'user', principal_id: U1, permission_key: null, access_level: 'access' }] });
const mode = await api('PATCH', `/teamspaces/${id}/access-mode`, { access_mode: 'selected' });
const g = (await api('GET', `/teamspaces/${id}`)).j?.data;
return done({ id, acl: acl.s, mode: mode.s, desc: g?.description, keys: Object.keys(g || {}).join(',') });
