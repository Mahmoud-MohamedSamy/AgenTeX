const d = page.locator('[role=dialog]').first();
await d.locator('input[placeholder="Field Sales mobile app"]').fill('QA R2W5 Client');
await d.locator('label', { hasText: 'QA R2W5 Module' }).first().click(); await sleep(400);
await d.locator('button', { hasText: /^Next$/ }).click(); await sleep(2500);
await shot('i02-step2');
const t1 = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
const btns = await page.$$eval('[role=dialog] button', bs => bs.map(b => b.innerText.trim()).filter(Boolean));
return { t1: t1.slice(0, 1200), btns };
