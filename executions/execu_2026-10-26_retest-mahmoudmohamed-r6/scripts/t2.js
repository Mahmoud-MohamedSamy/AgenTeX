const ME = '3445ec4a-020e-4f12-b156-dd2de7610164', U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2', id = 'f7082675-ea1b-4220-bfd2-47925ef97570';
let acl; for (let i = 0; i < 3; i++) { acl = await api('PUT', `/teamspaces/${id}/acl`, { rows: [{ principal_kind: 'user', principal_id: ME, permission_key: null, access_level: 'admin' }, { principal_kind: 'user', principal_id: U1, permission_key: null, access_level: 'access' }] }); if (acl.s < 300) break; await sleep(3000); }
return done({ acl: acl.s + ' ' + acl.t.slice(0, 200), now: (await api('GET', `/teamspaces/${id}/acl`)).t.slice(0, 500) });
