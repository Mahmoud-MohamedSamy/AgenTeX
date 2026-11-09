const rq = page.waitForResponse(r => /reporting\/reports/.test(r.url()) && ['POST', 'PUT', 'PATCH'].includes(r.request().method()), { timeout: 30000 }).catch(() => null);
await page.locator('button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
if (await page.locator('[role=dialog]').count()) { const d = page.locator('[role=dialog]').first(); await d.locator('input').first().fill('QA R2W5 Matrix'); await d.locator('button', { hasText: /^Save$/ }).first().click(); }
const r = await rq; await sleep(5000);
const res = { save: r ? r.request().method() + ' ' + r.status() + ' ' + (await r.text()).slice(0, 200) : 'none', url: page.url().replace(H, '') };
// open the view and test drill-down: click a number cell
await page.goto(H + '/reports/view/564a6465-eba0-4bea-97d2-7bab1412f6fc', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1000); if (/Grand total/.test(await page.innerText('main'))) break; }
await shot('s02-matrix-view');
const cells = page.locator('main td', { hasText: /^12$/ });
res.cells12 = await cells.count();
const net = []; const on = x => { if (/drill|underlying|query/.test(x.url())) net.push(x.request().method() + ' ' + x.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' ' + x.status()); }; page.on('response', on);
if (res.cells12) { await cells.first().click(); await sleep(3000); }
page.off('response', on);
res.net = net;
const dlg = await page.locator('[role=dialog], [role=menu]').count();
res.afterClick = dlg ? (await page.locator('[role=dialog], [role=menu]').first().innerText()).replace(/\s+/g, ' ').slice(0, 800) : 'no popup; url ' + page.url().replace(H, '');
await shot('s02-drill');
return res;
