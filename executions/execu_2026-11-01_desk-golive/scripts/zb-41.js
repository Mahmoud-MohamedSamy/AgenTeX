const moveUI = async (id, n) => {
  await openT(page, id); const r = {}; const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) { await nn.first().click().catch(() => {}); await page.waitForTimeout(800); } await page.mouse.wheel(0, -2000);
  r.before = (await api(page, 'GET', 'tickets/' + id)).j.assigneeId;
  await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500);
  await page.locator('li').filter({ hasText: 'Move' }).first().click();
  const dep = page.locator('[data-id="listDepartment_Tech"]');
  for (let i = 0; i < 15; i++) { await page.waitForTimeout(1500); if (await dep.count()) break; }
  await page.waitForTimeout(1500); await dep.last().click({ force: true }); await page.waitForTimeout(3000);
  r.confirm = (await body(page)).match(/Move Ticket #\d+\?.{0,160}/)?.[0]; await shotZ(page, 'c6-' + n + '-confirm');
  const mb = page.locator('input[type=button][value="Move"]'); if (await mb.count()) await mb.last().click(); else await page.getByText('Move', { exact: true }).last().click(); await page.waitForTimeout(6000);
  const t = await api(page, 'GET', 'tickets/' + id); r.after = { dept: t.j.departmentId, assignee: t.j.assigneeId, status: t.j.status };
  await openT(page, id); r.owner = (await body(page)).match(/Ticket Owner.{0,60}/)?.[0]; await shotZ(page, 'c6-' + n + '-after');
  return r; };
out.t111 = await moveUI('1499272000000451419', '111');
out.t112 = await moveUI('1499272000000451460', '112');
