await page.goto(H + '/reports', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1000); if (await page.locator('text=QA R2W5 Report rollup').count()) break; }
const t0 = Date.now();
await page.locator('text=QA R2W5 Report rollup').first().click();
let t = '';
for (let i = 0; i < 40; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (/R5-0003/.test(t)) break; }
const secs = (Date.now() - t0) / 1000;
await shot('s02-report-view');
const btns = await page.$$eval('main button, main [role=menuitem], main a', bs => bs.map(b => (b.getAttribute('aria-label') || b.getAttribute('title') || b.innerText || '').trim()).filter(Boolean));
return { url: page.url().replace(H, ''), secs, text: t.slice(0, 1000), btns: [...new Set(btns)].slice(0, 60) };
