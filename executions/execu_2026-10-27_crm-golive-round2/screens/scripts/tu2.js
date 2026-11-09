await page.locator('header button:has-text("AR")').first().click(); await sleep(800); await page.locator('text=English').first().click(); await sleep(3000);
out.lang = await page.evaluate(() => document.documentElement.lang);
// record of Admin B as test user 2
const REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632', L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
out.api = (await api('GET', `/modules/${L}/records/${REC}`)).s;
await page.goto(B + `/modules/${L}/records/${REC}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 90; i++) { await sleep(1000); if (/Timeline/.test(await page.innerText('main').catch(() => ''))) break; }
out.recText = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 300);
out.tabs = await page.$$eval('main [role=tab], main button', es => es.map(e => e.innerText.trim()).filter(t => t && t.length < 15)).then(a => [...new Set(a)]);
await page.goto(B + '/workqueue', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 90; i++) { await sleep(1000); if (/Rows per page/.test(await page.innerText('main').catch(() => ''))) break; } await sleep(3000);
out.wqCols = await page.$$eval('main button[aria-label^="Column options"]', es => es.length);
out.wqText = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 300);
