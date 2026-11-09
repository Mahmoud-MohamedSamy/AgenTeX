const reqs = []; const h = async r => { const q = r.request(); if (q.url().includes('/api/v1/') && q.method() !== 'GET') reqs.push(q.method() + ' ' + q.url().split('/api/v1')[1].slice(0, 80) + ' ' + (q.postData() || '').slice(0, 600) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 300)); };
page.on('response', h);
const head = page.locator('main thead input[type=checkbox], main [role=columnheader] input[type=checkbox]').first();
await head.check(); await sleep(1000);
out.afterHead = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 400);
const allm = page.locator('main button:has-text("Select all"), main a:has-text("Select all")').first();
out.hasSelectAll = await allm.count();
if (out.hasSelectAll) { await allm.click(); await sleep(800); out.afterAll = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 400); }
// un-tick one row to test exclusion
await page.locator('main tbody input[type=checkbox]').nth(0).uncheck(); await sleep(500);
out.afterExclude = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 300);
await page.click('main button:has-text("Delete")'); await sleep(1500);
out.dialog = await page.$$eval('[role=dialog], [role=alertdialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 300)));
await page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /^Delete/ }).last().click();
for (let i = 0; i < 30; i++) { await sleep(1000); if (reqs.length) break; } await sleep(4000);
out.after = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 500);
await page.screenshot({ path: RAW + 'md-after-all.png' });
page.off('response', h); out.reqs = reqs;
