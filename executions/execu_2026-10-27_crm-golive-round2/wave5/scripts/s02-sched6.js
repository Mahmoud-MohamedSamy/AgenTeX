const d = page.locator('[role=dialog]').first();
await d.locator('button', { hasText: /Choose Template/ }).first().click(); await sleep(1200);
const tpl = await page.$$eval('[role=option], [role=menuitem], [cmdk-item]', os => os.map(o => o.innerText.trim()));
await shot('s02-sched-templates');
if (tpl.length) { await page.locator('[role=option], [role=menuitem], [cmdk-item]').first().click(); await sleep(800); }
await d.locator('button', { hasText: /^Next$/ }).click(); await sleep(1500);
await shot('s02-sched-step5');
const txt = (await d.innerText()).replace(/\s+/g, ' ');
const btns = await page.$$eval('[role=dialog] button', bs => bs.map(b => b.innerText.trim()).filter(Boolean));
return { tpl: tpl.slice(0, 10), txt: txt.slice(0, 1800), btns };
