await page.locator('main label:has-text("No Answer"), main button:has-text("No Answer"), main [role=checkbox]:has-text("No Answer")').first().click().catch(e => out.e1 = String(e.message).slice(0, 80));
await sleep(1000);
const apply = page.locator('main button:has-text("Apply")').first(); if (await apply.count()) { await apply.click(); out.applied = true; }
await sleep(4000);
out.before = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Based on criteria.{0,300}/)?.[0];
await page.screenshot({ path: RAW + 'wq-filter-set.png' });
const url = page.url(); out.url = url.replace(B, '');
await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(1000); if (await page.locator('main tbody tr td').count() > 3) break; }
await sleep(3000);
out.afterReload = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Based on criteria.{0,300}/)?.[0];
await page.screenshot({ path: RAW + 'wq-filter-after-reload.png' });
