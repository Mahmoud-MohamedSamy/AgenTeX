await page.locator('[role=option]:has-text("Owner")').last().click(); await sleep(1200);
await page.locator('[role=dialog] button:has-text("Operator"), [role=dialog] button[aria-label^="Operator"]').first().click().catch(() => {}); await sleep(800);
out.ops = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim()));
await page.locator('[role=option]').first().click().catch(() => {}); await sleep(1200);
out.valueControls = await page.$$eval('[role=dialog] input, [role=dialog] button, [role=dialog] [role=combobox]', es => es.filter(e => e.offsetParent).map(e => e.tagName + ':' + (e.type || '') + ':' + (e.getAttribute('aria-label') || e.placeholder || e.innerText || '').trim().slice(0, 40)));
out.text = (await page.$$eval('[role=dialog]', es => es[0].innerText.replace(/\s+/g, ' ').slice(0, 800)));
await page.screenshot({ path: RAW + 'wq-create-owner.png' });
await page.locator('[role=dialog] button:has-text("Cancel")').last().click(); await sleep(1000);
out.closed = (await page.$$eval('[role=dialog]', es => es.length));
