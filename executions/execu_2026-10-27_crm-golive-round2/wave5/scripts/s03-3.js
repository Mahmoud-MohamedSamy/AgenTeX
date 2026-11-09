const d = page.locator('[role=dialog]').first();
await d.locator('text=Chart').first().click(); await sleep(500);
await d.locator('button', { hasText: /^Next$/ }).click(); await sleep(3000);
await shot('s03-chart-config');
const t = (await page.locator('[role=dialog]').first().innerText().catch(() => page.innerText('main'))).replace(/\s+/g, ' ');
const ctrls = await page.$$eval('[role=dialog] input, [role=dialog] select, [role=dialog] button, [role=dialog] [role=combobox]', es => es.map(e => [e.tagName, e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText.trim().slice(0, 30), e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('/').slice(0, 200) : ''].join(':')));
return { text: t.slice(0, 2000), ctrls: ctrls.slice(0, 50) };
