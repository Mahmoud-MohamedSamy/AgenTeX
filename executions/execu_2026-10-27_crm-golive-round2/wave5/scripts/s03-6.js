const res = {};
const rq = page.waitForResponse(r => /reporting\/dashboards/.test(r.url()) && ['POST', 'PUT'].includes(r.request().method()), { timeout: 30000 }).catch(() => null);
await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
if (await page.locator('[role=dialog]').count()) { const d = page.locator('[role=dialog]').first(); res.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); await d.locator('input').first().fill('QA R2W5 Dashboard'); await shot('s03-save-dlg'); await d.locator('button', { hasText: /^Save$/ }).first().click(); }
const r = await rq; await sleep(4000);
res.save = r ? r.status() + ' ' + (await r.text()).slice(0, 300) : 'none';
res.url = page.url().replace(H, '');
await shot('s03-saved');
res.text = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 600);
const btns = await page.$$eval('main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean));
res.btns = [...new Set(btns)];
return res;
