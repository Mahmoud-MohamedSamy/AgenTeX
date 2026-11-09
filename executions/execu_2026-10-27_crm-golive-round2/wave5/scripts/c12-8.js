const res = {};
await page.goto(H + '/settings/teamspace', { waitUntil: 'domcontentloaded' }); await sleep(4000);
res.list = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Create New Teamspace.{0,500}/)?.[0];
await page.locator('main', { hasText: 'QA R2W5 TS' }).locator('text=QA R2W5 TS').first().click(); await sleep(4000);
res.url = page.url().replace(H, '');
res.edit = (await page.innerText('main')).replace(/\s+/g, ' ').match(/QA R2W5 TS.{0,400}/)?.[0];
await shot('c12-edit-open');
// rename folder: double-click or menu on folder
const f = page.locator('text=/^QA F1$/').first(); await f.dblclick().catch(() => {}); await sleep(800);
const active = await page.evaluate(() => document.activeElement && document.activeElement.tagName + ':' + (document.activeElement.value || ''));
res.active = active;
if (/INPUT/.test(active)) { await page.keyboard.press('Control+A'); await page.keyboard.type('QA F1 renamed'); await page.keyboard.press('Enter'); await sleep(600); }
await shot('c12-1695-renamed');
const rq = page.waitForResponse(r => /\/teamspaces/.test(r.url()) && ['PUT', 'PATCH', 'POST'].includes(r.request().method()), { timeout: 30000 }).catch(() => null);
await page.locator('main button', { hasText: /^Save$/ }).click(); const r = await rq; await sleep(3000);
res.save = r ? r.request().method() + ' ' + r.url().replace(/^.*\/api\/v1/, '') + ' ' + r.status() : 'none';
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(5000);
res.afterReload = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Create Folder.{0,120}/)?.[0];
await shot('c12-1695-reloaded');
return res;
