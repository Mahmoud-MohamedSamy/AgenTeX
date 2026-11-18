await page.waitForTimeout(25000);
const TE = '1499272000000006907', TC = '1499272000000432293';
const m1 = await api(page, 'POST', 'tickets/1499272000000451889/move', { departmentId: TC }); out.moveZ8 = m1.s + ' ' + m1.t.slice(0, 120);
const m2 = await api(page, 'POST', 'tickets/1499272000000451682/move', { departmentId: TE }); out.moveZ3 = m2.s + ' ' + m2.t.slice(0, 120);
const t3 = (await api(page, 'GET', 'tickets/1499272000000451682')).j; out.z3 = { dept: t3.departmentId, status: t3.status, owner: t3.assigneeId, shared: JSON.stringify(t3.sharedDepartments) };
