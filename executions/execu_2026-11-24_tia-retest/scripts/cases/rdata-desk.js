const all = ids(); const out = {};
out.ticket = (await api('DELETE', `/modules/${M.tickets}/records/${all.t1}`)).s;
const g = (await api('GET', '/desk/departments/' + DEPT_A)).j.data;
out.dept = (await api('PATCH', '/desk/departments/' + DEPT_A, { ...g, agent_user_ids: all.deptA_before })).s;
const g2 = (await api('GET', '/desk/departments/' + DEPT_A)).j.data; out.deptSame = JSON.stringify([...g2.agent_user_ids].sort()) === JSON.stringify([...all.deptA_before].sort());
out.perm = (await api('DELETE', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions/ai:tia:use`)).s;
let p = arr((await api('GET', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`)).j?.data);
if (p.some(x => x.permissionKey === 'ai:tia:use')) { out.perm2 = (await api('DELETE', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`, { permission_key: 'ai:tia:use' })).s; p = arr((await api('GET', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`)).j?.data); }
out.permCount = p.length; out.hasTia = p.some(x => x.permissionKey === 'ai:tia:use');
const t = (await api('GET', `/modules/${M.tickets}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'starts_with', value: 'QA TIA RT' }]))}`)); out.ticketsLeft = arr(t.j?.data).length;
ledger(`R-01/R-02 Desk: ticket ${out.ticket}, dept restore ${out.dept} same=${out.deptSame}, Desk Agent ai:tia:use removed hasTia=${out.hasTia} count=${out.permCount}`);
return out;
