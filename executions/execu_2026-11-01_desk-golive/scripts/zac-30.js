const TE = '1499272000000006907', TC = '1499272000000432293', A2 = '1499272000000432034', A1 = '1499272000000432003', MA = '1499272000000139001';
out.rm = (await api(page, 'PATCH', 'agents/' + A2, { associatedDepartmentIds: [TE] })).s;
const mk = async (k, dep, owner, extra) => { const b = { subject: 'QA AC2 ' + k, departmentId: dep, contact: { lastName: 'QA AC2 Zoho', email: 'qa-ac2-z@example.com' }, channel: 'Phone', status: 'Open', description: 'QA AC2 ' + k, ...(extra || {}) }; if (owner) b.assigneeId = owner; const r = await api(page, 'POST', 'tickets', b); return r.j && r.j.id ? r.j.id : 'ERR ' + r.s + ' ' + r.t.slice(0, 150); };
out.T = {}; for (const [k, d, o] of [['Y1', TC, MA], ['Y2', TC, MA], ['Y3', TE, A2], ['Y4', TC, MA], ['Y5', TE, A1]]) out.T[k] = await mk(k, d, o);
for (const [k, t] of [['Y1', 'READ_WRITE'], ['Y2', 'READ_WRITE'], ['Y4', 'RESTRICTED_ACCESS']]) out['sh' + k] = (await api(page, 'PATCH', 'tickets/' + out.T[k], { sharedDepartments: [{ id: TE, type: t }] })).s;
const t = (await api(page, 'GET', 'tickets/' + out.T.Y1)).j; out.contactId = t && t.contactId;
