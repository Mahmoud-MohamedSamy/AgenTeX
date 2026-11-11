await page.goto(H + '/activities', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Add Activity/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'Add Activity' }).click(); await sleep(1500);
await page.getByRole('menuitem', { name: /Task/ }).first().click().catch(() => page.getByText('Task', { exact: true }).last().click());
const d = page.locator('[role=dialog]').last();
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Department/i.test(await d.innerText().catch(() => ''))) break; } await sleep(2000);
log(await d.innerText());
log(await d.locator('label').allInnerTexts());
await shot('2635-add-task.png');
