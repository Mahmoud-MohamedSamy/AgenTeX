await go('/settings/modules-and-fields', 10000);
for (let i = 0; i < 20 && !(await page.getByRole('button', { name: /Create New Module/ }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: /Create New Module/ }).first().click(); await sleep(2500);
const d = await page.locator('[role=dialog]').allInnerTexts();
await shot('2220-01-create-dialog');
return done({ d: d.map(x => x.slice(0, 1000)) });
