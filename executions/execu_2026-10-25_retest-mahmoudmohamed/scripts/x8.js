const out = {};
const d = page.locator('[role=dialog]').last(); if (await d.count()) { await d.getByRole('button', { name: 'Cancel' }).click().catch(() => {}); await sleep(800); }
await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(1200); await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
const fs = page.locator('input[placeholder*="earch"]').last(); await fs.fill('Sta'); await sleep(600);
out.clearButtons = await page.locator('button[aria-label*="lear" i]').evaluateAll(es => es.map(e => e.getAttribute('aria-label')));
await shot('1819-08-filter-search-x');
const cb = page.locator('button[aria-label="Clear search"]').last(); if (await cb.count()) { await cb.click(); await sleep(400); out.afterClear = await fs.inputValue(); }
await page.keyboard.press('Escape'); await sleep(400); await page.getByRole('button', { name: 'Filter', exact: true }).click().catch(() => {}); await sleep(500);
return done(out);
