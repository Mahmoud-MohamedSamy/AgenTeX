const TE = '1499272000000006907', TC = '1499272000000432293', A2 = '1499272000000432034', A1 = '1499272000000432003', MA = '1499272000000139001';
const up = await api(page, 'PATCH', 'agents/' + A2, { associatedDepartmentIds: [TE] }); out.rm = up.s + ' ' + up.t.slice(0, 160);
const mk = async (k, dep, owner) => { const b = { subject: 'QA AC ' + k + ' access run', departmentId: dep, contact: { lastName: 'QA AC Zoho', email: 'qa-ac-z1@example.com' }, channel: 'Phone', status: 'Open', description: 'QA AC access run 17 Nov ' + k }; if (owner) b.assigneeId = owner; const r = await api(page, 'POST', 'tickets', b); return r.j && r.j.id ? r.j.id + '#' + r.j.ticketNumber : 'ERR ' + r.s + ' ' + r.t.slice(0, 150); };
out.T = {};
for (const [k, d, o] of [['Z1', TC, null], ['Z2', TC, MA], ['Z3', TC, MA], ['Z4', TC, MA], ['Z5', TE, A2], ['Z6', TE, A1], ['Z7', TC, MA], ['Z8', TE, A2]]) out.T[k] = await mk(k, d, o);
