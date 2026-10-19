const out = {};
await page.getByRole('button', { name: 'Create a queue on Leads' }).click(); await sleep(3000);
out.url = page.url(); out.dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 600);
await shot('NDC-1819-13-create-queue-on-leads');
await page.keyboard.press('Escape'); await sleep(1000);
if (await page.locator('[role=dialog]').count()) { const c = page.locator('[role=dialog]').last().getByRole('button', { name: /Cancel|Close/ }).first(); if (await c.count()) await c.click(); }
await sleep(1000); out.dialogsLeft = await page.locator('[role=dialog]').count();
await page.getByRole('button', { name: 'Add a queue' }).click(); await sleep(3000);
out.generic = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400); await shot('NDC-1819-13-add-queue-generic');
await page.keyboard.press('Escape'); await sleep(1000);
if (await page.locator('[role=dialog]').count()) { const c = page.locator('[role=dialog]').last().getByRole('button', { name: /Cancel|Close/ }).first(); if (await c.count()) await c.click(); }
return done(out);
