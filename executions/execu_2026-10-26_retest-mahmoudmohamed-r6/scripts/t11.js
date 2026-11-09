const id = '766590c6-59f8-432c-ae22-c74d77b3bb7a', U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2';
const a = await api('PUT', `/teamspaces/${id}/acl`, { rows: [{ principal_kind: 'user', principal_id: U1, permission_key: null, access_level: 'admin' }, { principal_kind: 'org_unit', principal_id: '5533f730-cd59-4432-970b-86090192787d', permission_key: null, access_level: 'access' }] });
return done({ acl: a.s + ' ' + a.t.slice(0, 300) });
