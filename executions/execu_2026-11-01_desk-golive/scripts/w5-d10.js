await go('/analytics/dashboards/builder', 12000);
const disc = page.getByRole('button', { name: 'Discard them' }); if (await disc.count()) { await disc.click(); await sleep(2000); }
await page.getByLabel('Dashboard name').fill('QA GL W5 dashboard');
await page.getByRole('button', { name: 'Add report QA GL W5 report' }).first().click(); await sleep(4000);
out.after1 = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 1200);
out.ctl = await page.locator('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean));
out.dialogs = await page.locator('[role=dialog]').count();
await shot('w5/W5-30-after-first');
return fin({ out });
