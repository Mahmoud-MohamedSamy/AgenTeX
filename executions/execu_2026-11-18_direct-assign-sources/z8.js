await page.waitForTimeout(8000);
for (const p of ['mailConfigs?departmentId=1499272000000006907', 'mailReplyAddress?departmentId=1499272000000006907', 'departments/1499272000000006907', 'webForms', 'webforms?departmentId=1499272000000006907']) {
  const r = await api(page, 'GET', p); out[p] = r.s + ' ' + r.t.replace(/[A-Za-z0-9._%+-]+@gmail\.com/g, '<gmail>').slice(0, 300);
}
