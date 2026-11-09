const res = {};
const t0 = Date.now();
await page.goto(H + '/dashboards/view/dcb5e49b-683c-4bb3-a5c4-a535f0e71cb6', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1000); if (/row/.test(await page.innerText('main').catch(() => ''))) break; }
res.secs = (Date.now() - t0) / 1000;
await sleep(2000);
await shot('s03-view');
res.text = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 500);
res.btns = [...new Set(await page.$$eval('main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean)))];
const net = []; const on = x => { if (/reporting/.test(x.url())) net.push(x.request().method() + ' ' + x.url().replace(/^.*\/api\/v1/, '').slice(0, 100) + ' ' + x.status()); }; page.on('response', on);
const box = await page.locator('main svg').first().boundingBox().catch(() => null); res.box = box;
const rect = page.locator('main svg path.recharts-rectangle, main svg .recharts-bar-rectangle path, main svg rect').first();
if (await rect.count()) { const b = await rect.boundingBox(); res.rect = b; if (b) await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); }
await sleep(3000);
await shot('s03-view-drill');
res.pop = await page.evaluate(() => [...document.querySelectorAll('[role=dialog], [role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).join(' || ').slice(0, 1200));
res.url = page.url().replace(H, '');
page.off('response', on); res.net = net.slice(-8);
return res;
