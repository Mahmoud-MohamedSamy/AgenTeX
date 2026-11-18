const PEERS=true;
const A1 = '1499272000000432003', A2 = '1499272000000432034', MGR = '1499272000000008339';
const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); };
out.a1 = await pr('PATCH', 'agents/' + A1, { rolePermissionType: 'Custom', roleId: MGR, profileId: '1499272000000008345' }); out.a2 = await pr('PATCH', 'agents/' + A2, { rolePermissionType: 'Custom', roleId: MGR, profileId: '1499272000000008345' });
const g = id => api(page, 'GET', 'agents/' + id).then(r => [r.j.roleId.slice(-5), r.j.rolePermissionType].join(' ')); out.now = [await g(A1), await g(A2)];
out.ds = await pr('PATCH', 'dataSharingRules', { tickets: 'private' });
out.peers = await pr('PATCH', 'roles/' + MGR, { shareDataWithPeers: PEERS });
