const d = page.locator('[role=dialog]').first();
await d.locator('input[type=date]').fill('2026-10-30'); await d.locator('input[type=time]').fill('08:00'); await sleep(500);
await d.locator('button', { hasText: /^Daily$/ }).click(); await sleep(800);
const rep = await page.$$eval('[role=option], [role=menuitem]', os => os.map(o => o.innerText.trim()));
await page.keyboard.press('Escape'); await sleep(400);
// try the "Ends On" radio with an end before the start
await d.locator('input[type=radio]').nth(1).check().catch(() => {}); await sleep(800);
const extra = await page.$$eval('[role=dialog] input', es => es.map(e => e.type));
const dates = d.locator('input[type=date]');
let endMsg = null;
if (await dates.count() > 1) { await dates.nth(1).fill('2026-10-29'); await sleep(800); endMsg = (await d.innerText()).replace(/\s+/g, ' ').match(/[^.]{0,80}(end date|after)[^.]{0,80}/gi); await shot('s02-sched-end-before-start'); await dates.nth(1).fill('2026-11-05'); }
await d.locator('input[type=radio]').nth(0).check().catch(() => {}); await sleep(400);
await d.locator('button', { hasText: /^Next$/ }).click(); await sleep(1500);
await shot('s02-sched-step4');
const txt = (await d.innerText()).replace(/\s+/g, ' ');
return { rep, extra, endMsg, txt: txt.slice(0, 1800) };
