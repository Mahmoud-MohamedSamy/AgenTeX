const c = page.getByText('Cancel', { exact: true }).filter({ visible: true }); if (await c.count()) await c.last().click().catch(() => {}); await page.waitForTimeout(2000);
const id = '1499272000000451502';
const m = await api(page, 'POST', 'tickets/' + id + '/move', { departmentId: '1499272000000432293' }); out.move = m.s + ' ' + m.t.slice(0, 200);
await page.waitForTimeout(3000);
const t = await api(page, 'GET', 'tickets/' + id); out.after = { dept: t.j.departmentId.slice(-4), assignee: t.j.assigneeId };
