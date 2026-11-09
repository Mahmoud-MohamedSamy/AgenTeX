const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(B + '/', { waitUntil: 'domcontentloaded' }); await sleep(5000);
await page.locator('header button:has-text("EN")').first().click(); await sleep(800); await page.locator('text=العربية').first().click(); await sleep(3000);
const t0 = Date.now();
await page.goto(B + '/modules/' + D, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 120; i++) { await sleep(1000); const t = await page.innerText('main').catch(() => ''); if (/[\u0660-\u0669]+\s*سجل/.test(t)) break; }
out.sec = (Date.now() - t0) / 1000;
out.head = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 400);
out.count = ((await page.innerText('main')).match(/[\u0660-\u0669\d,٬]+\s*سجل\S*/g) || []).slice(0, 3);
out.sortLabel = ((await page.innerText('main')).match(/ترتيب[^\n]{0,50}/) || [''])[0];
out.layoutAria = await page.$$eval('[aria-label]', es => es.map(e => e.getAttribute('aria-label')).filter(a => /تخطيط|Layout/.test(a)));
await page.screenshot({ path: RAW + 'ar-deals-list.png' });
// home meetings columns
await page.goto(B + '/', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(1000); if (/اجتماعاتي اليوم/.test(await page.innerText('main').catch(() => ''))) break; } await sleep(2000);
out.homeCols = await page.$$eval('main th, main [role=columnheader]', es => es.map(e => e.innerText.trim()));
await page.screenshot({ path: RAW + 'ar-home-2.png' });
