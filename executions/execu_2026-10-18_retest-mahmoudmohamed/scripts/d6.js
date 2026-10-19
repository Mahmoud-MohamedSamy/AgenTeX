const out = {}; const resp = [];
const fr = async r => { if (r.request().method() === 'DELETE') resp.push(r.status() + ' DELETE ' + r.url().replace(API, '')); };
page.on('response', fr);
const href = await page.$$eval('a', as => (as.find(a => a.innerText.trim() === 'Leads') || {}).href || ''); out.href = href; await page.goto(href || (H + '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3'), { waitUntil: 'commit' }); await sleep(10000);
out.url = page.url();
const row = page.locator('tbody tr', { hasText: 'QA RT del-wq' }).first(); out.found = await row.count();
if (!out.found) { const s = page.getByPlaceholder(/Search/i).last(); await s.fill('QA RT del-wq'); await s.press('Enter'); await sleep(5000); out.found = await row.count(); }
await shot('NDC-1821-leads-list-before-delete');
await row.hover(); await sleep(500);
await row.locator('button').first().click(); await sleep(1000);
out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
await page.getByRole('menuitem', { name: 'Delete' }).click(); await sleep(1500);
out.confirm = (await page.locator('[role=alertdialog], [role=dialog]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
await page.locator('[role=alertdialog], [role=dialog]').last().getByRole('button', { name: /^Delete/ }).click(); await sleep(5000);
await shot('NDC-1821-leads-list-after-delete');
page.off('response', fr); out.resp = resp; return done(out);
