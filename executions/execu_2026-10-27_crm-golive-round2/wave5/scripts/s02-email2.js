const d = page.locator('[role=dialog]').first();
await d.locator('text=CSV').first().click(); await sleep(400);
await d.locator('button', { hasText: /^Next$/ }).click(); await sleep(2000);
await shot('s02-email-step2');
const txt = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
const ctrls = await page.$$eval('[role=dialog] input, [role=dialog] select, [role=dialog] textarea, [role=dialog] button', es => es.map(e => [e.tagName, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText.trim().slice(0, 30)].join(':')));
return { txt: txt.slice(0, 1500), ctrls };
