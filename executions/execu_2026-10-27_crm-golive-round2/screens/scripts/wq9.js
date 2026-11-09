const rail = async () => (await page.$$eval('main', es => es[0].innerText.replace(/\s+/g, ' ').match(/My Work Queues.{0,120}/)?.[0]));
out.railBefore = await rail();
await page.locator('[role=dialog] :text("As one list")').first().click(); await sleep(1200);
out.dialogAfterToggle = (await page.$$eval('[role=dialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 300))))[0];
out.railWhileOpen = await rail();
await page.screenshot({ path: RAW + 'wq-arrange-list.png' });
await page.locator('[role=dialog] button:has-text("Cancel")').click(); await sleep(1200);
out.railAfterCancel = await rail();
await page.screenshot({ path: RAW + 'wq-arrange-cancel.png' });
