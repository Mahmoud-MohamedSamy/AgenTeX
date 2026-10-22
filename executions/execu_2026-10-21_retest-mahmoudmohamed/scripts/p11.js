const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', TU1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2';
const c = await api('POST', '/teamspaces', { name: 'QA RT 1172', accessMode: 'selected' });
const id = c.j?.data?.id; const out = { create: c.s + ' ' + c.t.slice(0, 300), id };
if (id) {
  const acl0 = await api('GET', `/teamspaces/${id}/acl`); out.acl0 = acl0.t.slice(0, 400);
  const body = { access_mode: 'selected', rows: [{ principal_kind: 'user', principal_id: OWNER, permission_key: null, access_level: 'admin' }, { principal_kind: 'user', principal_id: TU1, permission_key: null, access_level: 'member' }] };
  let p = await api('PUT', `/teamspaces/${id}/acl`, body); out.put = p.s + ' ' + p.t.slice(0, 400);
  if (p.s >= 300) { p = await api('PUT', `/teamspaces/${id}/acl`, { accessMode: 'selected', rows: body.rows.map(r => ({ principalKind: r.principal_kind, principalId: r.principal_id, accessLevel: r.access_level })) }); out.put2 = p.s + ' ' + p.t.slice(0, 400); }
  out.acl1 = (await api('GET', `/teamspaces/${id}/acl`)).t.slice(0, 500);
  out.ts = (await api('GET', `/teamspaces/${id}`)).t.slice(0, 300);
}
return out;
