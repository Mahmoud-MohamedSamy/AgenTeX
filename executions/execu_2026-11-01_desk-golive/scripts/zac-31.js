const TC = '1499272000000432293', MA = '1499272000000139001';
const b = { subject: 'QA AC2 Y6', departmentId: TC, contactId: '1499272000000451979', channel: 'Phone', status: 'Open', assigneeId: MA }; const r = await api(page, 'POST', 'tickets', b); out.Y6 = r.j && r.j.id;
