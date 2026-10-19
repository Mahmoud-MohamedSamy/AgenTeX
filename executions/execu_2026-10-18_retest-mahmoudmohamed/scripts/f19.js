// NDC-1819: "Hide column" on the Tasks "Mark as completed" and "Row actions" columns.
const out = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks\b/ }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: /^Tasks\b/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500);
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(', ');
out.before = await heads();
for (const n of [1, 0]) { await page.locator('main thead th').nth(n).locator('button').first().click(); await sleep(800); if (n === 1) await shot('NDC-1819-f-util-tasks-col2-menu'); await page.getByRole('menuitem', { name: /Hide column/ }).click(); await sleep(2500); out['afterHide' + n] = await heads(); }
return done(out);
