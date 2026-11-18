await page.keyboard.press('Escape'); await page.mouse.click(740, 217); await page.waitForTimeout(2000);
await shotZ(page, 'c6-113-dept-open');
out.opts = await page.locator('li,[role=option]').evaluateAll(es => es.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.y > 200 && r.y < 500 && r.x > 550 && r.x < 950; }).map(e => e.innerText.trim() + '|' + (e.getAttribute('data-id') || '')));
