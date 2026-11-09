await page.locator('[role=dialog] button[aria-label="Layout"], [role=dialog] button:has-text("Select a layout")').first().click(); await sleep(1000);
await page.locator('[role=option]:has-text("Standard")').first().click().catch(e => out.e = String(e.message).slice(0, 80)); await sleep(800);
await page.locator('[role=dialog] button:has-text("Next")').click(); await sleep(3000);
out.step2 = (await page.$$eval('[role=dialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 1500))))[0];
out.buttons2 = await page.$$eval('[role=dialog] button, [role=dialog] [role=radio]', es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean));
await page.screenshot({ path: RAW + 'wq-create-2.png' });
