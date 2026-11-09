const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b';
await page.goto(H + '/settings/modules-and-fields/' + M, { waitUntil: 'domcontentloaded' }); await sleep(5000);
await page.locator('button,[role=tab]', { hasText: /^\s*Map Dependency Fields\s*$/ }).first().click(); await sleep(2500);
await page.locator('button', { hasText: 'New Dependency' }).first().click(); await sleep(2500);
await shot('c05-new-dialog');
const d = page.locator('[role=dialog]').first();
const txt = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
const ctrls = await page.$$eval('[role=dialog] input, [role=dialog] select, [role=dialog] button, [role=dialog] [role=combobox]', es => es.map(e => [e.tagName, e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText.trim().slice(0, 40), e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('/') : ''].join(':')));
return { txt: txt.slice(0, 1200), ctrls };
