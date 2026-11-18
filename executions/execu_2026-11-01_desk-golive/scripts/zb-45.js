await page.mouse.click(868, 218); await page.waitForTimeout(2000);
out.opts = await page.locator('li,[role=option]').evaluateAll(es => es.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.y > 150 && r.y < 600; }).map(e => e.innerText.trim() + '|' + (e.getAttribute('data-id') || '')).slice(0, 10));
await shotZ(page, 'c6-113-dept-open2');
