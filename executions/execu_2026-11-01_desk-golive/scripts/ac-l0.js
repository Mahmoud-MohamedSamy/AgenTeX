const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 140) : ''); };
out.assign = await pr('POST', '/iam/users/' + US.D + '/profiles', { profile_id: '44444444-4444-4444-4444-444444444403', scope_id: 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd', replace: true });
const us = D((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j); out.d = ((us.items || us).find(u => u.userId === US.D) || {}).profileNames;
// can a light agent be made ticket owner / team member?
out.ownerLight = await pr('POST', '/desk/tickets/' + TK.CSU + '/assign', { owner_id: US.D });
const nt = await api('POST', '/desk/teams', { name: 'QA AC Light Team', description: 'access run, delete after', department_id: DEP.CS, sources: [{ kind: 'agent', ref_id: US.D }], color: 'blue', icon: 'star' }); out.teamLight = nt.s + ' ' + nt.t.slice(0, 160); if (D(nt.j)?.id) CREATED.push({ kind: 'team', id: D(nt.j).id, name: 'QA AC Light Team' });
return fin({ out });
