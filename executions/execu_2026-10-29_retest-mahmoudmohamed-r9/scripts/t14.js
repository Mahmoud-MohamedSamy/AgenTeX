const id = 'f7082675-ea1b-4220-bfd2-47925ef97570', U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2';
const P = { User: '11111111-1111-1111-1111-111111111103', Supervisor: '11111111-1111-1111-1111-111111111104', test: '64d4aae0-9abd-486b-bc03-d04e22d87160' };
const rows = [{ principal_kind: 'user', principal_id: U1, permission_key: null, access_level: 'admin' }, ...Object.values(P).map(p => ({ principal_kind: 'profile', principal_id: p, permission_key: null, access_level: 'access' }))];
const a = await api('PUT', `/teamspaces/${id}/acl`, { rows });
return done({ acl: a.s + ' ' + (a.s >= 300 ? a.t.slice(0, 200) : JSON.stringify(a.j?.data?.rows?.map(r => r.principal_kind + ':' + r.principal_id.slice(0, 8) + ':' + r.access_level))) });
