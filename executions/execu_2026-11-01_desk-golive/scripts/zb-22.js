out.checked = await page.locator('input[type=checkbox]').evaluateAll(es => es.filter(e => e.checked).length);
await page.getByText('More', { exact: true }).first().click(); await page.waitForTimeout(1500);
out.moreItems = await page.locator('li').evaluateAll(es => es.filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y > 50 && e.getBoundingClientRect().y < 500 && e.getBoundingClientRect().x > 300 && e.getBoundingClientRect().x < 1100).map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
await shotZ(page, 'list-more'); await page.keyboard.press('Escape');
