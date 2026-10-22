const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', id = '6efdaee1-c891-4b6e-bc97-8db54f607138';
let prof = null; for (const u of ['/iam/profiles?limit=100', '/iam/profiles']) { const r = await api('GET', u); if (r.s === 200) { prof = arr(r.j.data).map(p => (p.profile_id || p.id || p.profileId) + ' ' + p.name); break; } }
const userProf = (prof || []).find(x => / User$/.test(x))?.split(' ')[0];
const p = await api('PUT', `/teamspaces/${id}/acl`, { access_mode: 'selected', rows: [{ principal_kind: 'user', principal_id: OWNER, permission_key: null, access_level: 'admin' }, { principal_kind: 'profile', principal_id: userProf, permission_key: null, access_level: 'access' }] });
return { prof, userProf, put: p.s + ' ' + p.t.slice(0, 300) };
