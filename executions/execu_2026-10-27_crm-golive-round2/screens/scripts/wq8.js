const dlg = async () => (await page.$$eval('[role=dialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 1200)))).filter(Boolean);
await page.locator('main button:has-text("Clear filters")').first().click().catch(e => out.clrErr = String(e.message).slice(0, 80)); await sleep(2500);
out.cleared = !/filter applied/.test(await page.innerText('main'));
// Arrange queues: Category view applies only after Save?
const railBefore = await page.evaluate(() => Object.entries(localStorage).filter(([k]) => k.startsWith('aw:crm:workqueue')).map(([k, v]) => v).join());
await page.click('main button[aria-label="Arrange queues"]'); await sleep(1500);
out.arrange = await dlg(); await page.screenshot({ path: RAW + 'wq-arrange.png' });
out.arrangeButtons = await page.$$eval('[role=dialog] button, [role=dialog] [role=radio], [role=dialog] label', es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean));
