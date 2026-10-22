const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const row = page.locator('tr').filter({ hasText: 'QA RT imp p50' }).first();
await row.locator('button').last().click(); await sleep(1000);
const menu = await page.locator('[role=menu]').allInnerTexts();
await page.getByRole('menuitem', { name: /Restore/ }).first().click(); await sleep(2000);
const dl = page.locator('[role=dialog],[role=alertdialog]'); if (await dl.count()) { await dl.last().getByRole('button', { name: /Restore/ }).click(); await sleep(3000); }
const r = await api('GET', `/modules/${L}/records/2e3666fe-3f70-427a-b2d8-0a4cee463a8c`);
await shot('1587-05-restored');
return done({ menu, rec: r.s + ' ' + ((r.j?.data?.data || []).find(x => x.field === 'name') || {}).value?.value });
