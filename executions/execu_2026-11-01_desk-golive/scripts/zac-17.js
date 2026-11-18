const A2 = '1499272000000432034'; out.t = [];
for (const v of ['AgentPersonal', 'Personal', 'AGENT_PERSONAL']) { const r = await api(page, 'PATCH', 'agents/' + A2, { rolePermissionType: v }); out.t.push(v + ' ' + r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 150) : (r.j.rolePermissionType + ' role ' + r.j.roleId))); if (r.s < 300) break; }
