await go('/knowledge-base', 12000);
out.addEls = await page.getByText('Add Article', { exact: true }).evaluateAll(es => es.map(e => e.tagName + ' ' + e.getAttribute('href') + ' ' + e.getAttribute('role'))); await page.getByText('Add Article', { exact: true }).first().click(); await sleep(6000);
out.url = page.url().replace(H, '');
out.form = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 1500);
out.ctrls = await page.locator('main input, main textarea, main select, main button[aria-haspopup], main [contenteditable=true], main [role=switch]').evaluateAll(es => es.map(e => [e.tagName, e.id, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || '', (e.innerText || e.value || '').trim().slice(0, 25)].join('|')));
out.btns = (await page.locator('main button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 40);
await shot('w4/W4-60-new-article');
return fin({ out });
