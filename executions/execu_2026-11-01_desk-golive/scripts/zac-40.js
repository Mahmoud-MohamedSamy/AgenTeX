const A1 = '1499272000000432003', A2 = '1499272000000432034', PERS = '1499272000000011005';
const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); };
out.a1 = await pr('PATCH', 'agents/' + A1, { rolePermissionType: 'AgentPersonal', profileId: '1499272000000008345' });
out.a2 = await pr('PATCH', 'agents/' + A2, { rolePermissionType: 'AgentPersonal' });
const g = id => api(page, 'GET', 'agents/' + id).then(r => [r.j.profileId.slice(-5), r.j.roleId.slice(-5), r.j.rolePermissionType].join(' '));
out.now = [await g(A1), await g(A2)];
out.peersOn = await pr('PATCH', 'roles/' + PERS, { shareDataWithPeers: true });
out.role = JSON.stringify((await api(page, 'GET', 'roles/' + PERS)).j).slice(0, 200);
