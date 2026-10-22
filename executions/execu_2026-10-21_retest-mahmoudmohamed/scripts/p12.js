const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', TU1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2', id = '6efdaee1-c891-4b6e-bc97-8db54f607138';
const p = await api('PUT', `/teamspaces/${id}/acl`, { access_mode: 'selected', rows: [{ principal_kind: 'user', principal_id: OWNER, permission_key: null, access_level: 'admin' }, { principal_kind: 'user', principal_id: TU1, permission_key: null, access_level: 'access' }] });
return { put: p.s + ' ' + p.t.slice(0, 300), acl: (await api('GET', `/teamspaces/${id}/acl`)).t.slice(0, 500), ts: (await api('GET', `/teamspaces/${id}`)).j?.data?.accessMode };
