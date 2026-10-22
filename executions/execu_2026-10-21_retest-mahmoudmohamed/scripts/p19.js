const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', id = '6efdaee1-c891-4b6e-bc97-8db54f607138', OU = '60aeb9ce-e602-4e95-aaef-de3ceba25a3e';
const out = {};
for (const kind of ['org_unit', 'orgunit', 'org-unit']) { const p = await api('PUT', `/teamspaces/${id}/acl`, { access_mode: 'selected', rows: [{ principal_kind: 'user', principal_id: OWNER, permission_key: null, access_level: 'admin' }, { principal_kind: kind, principal_id: OU, permission_key: null, access_level: 'access' }] }); out[kind] = p.s + ' ' + p.t.slice(0, 200); if (p.s < 300) break; }
return out;
