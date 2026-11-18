const TE = '1499272000000006907', A1 = '1499272000000432003';
const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : ''); };
out.t = [];
for (const b of [{ rolePermissionType: 'Light' }, { rolePermissionType: 'LightAgent' }, { rolePermissionType: 'Light', profileId: '1499272000000067003' }]) { const s = await pr('PATCH', 'agents/' + A1, b); const a = (await api(page, 'GET', 'agents/' + A1)).j; out.t.push(JSON.stringify(b) + ' => ' + s.slice(0, 120) + ' now ' + [a.profileId.slice(-5), a.rolePermissionType].join(' ')); if (a.profileId === '1499272000000067003') break; }
const a = (await api(page, 'GET', 'agents/' + A1)).j; out.isLight = a.profileId === '1499272000000067003';
out.team = await pr('POST', 'teams', { name: 'QA AC2 Light Team', departmentId: TE, description: 'access run, delete after', agents: [A1] });
