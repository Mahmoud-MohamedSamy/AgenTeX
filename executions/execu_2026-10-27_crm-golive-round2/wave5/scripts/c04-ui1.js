const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b';
await page.goto(H + '/settings/modules-and-fields/' + M, { waitUntil: 'domcontentloaded' }); await sleep(5000);
await page.locator('button,[role=tab]', { hasText: /^\s*Validation Rules\s*$/ }).first().click(); await sleep(2500);
await page.locator('button', { hasText: 'New Rule' }).first().click(); await sleep(2500);
await shot('c04-new-rule-dialog');
const d = page.locator('[role=dialog]').first();
const txt = (await d.innerText().catch(() => page.innerText('main'))).replace(/\s+/g, ' ');
const inputs = await page.$$eval('[role=dialog] input, [role=dialog] select, [role=dialog] textarea, [role=dialog] button, [role=dialog] [role=combobox]', es => es.map(e => [e.tagName, e.getAttribute('type'), e.getAttribute('name') || e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText.trim().slice(0, 40)].join(':')));
return { txt: txt.slice(0, 1500), inputs };
