await page.keyboard.press('Escape'); await openT(page, T109); out.spam = (await body(page)).includes('marked as spam');
await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(2000);
out.items = await page.locator('li').evaluateAll(es => es.filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().x > 1250).map(e => e.innerText.replace(/\s+/g, ' ').trim()));
await shotZ(page, 'menu-109');
