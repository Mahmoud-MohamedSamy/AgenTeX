const d = page.locator('[role=dialog]').first();
await d.locator('button[aria-label="Report 2"]').click(); await sleep(1500);
const o = await page.evaluate(() => [...document.querySelectorAll('[role=option], [cmdk-item], [role=listbox] *')].map(x => (x.innerText || '').trim()).filter(Boolean));
await shot('s02-join-r2-options');
const t = page.locator('[role=option], [cmdk-item]', { hasText: 'QA R2W5 Report 2' }).first();
const n = await t.count(); if (n) await t.click({ timeout: 5000 }).catch(() => {});
await sleep(800);
return { o: [...new Set(o)].slice(0, 20), n, after: (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500) };
