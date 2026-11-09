const res = {};
const net = []; const on = x => { if (/reporting/.test(x.url())) net.push(x.request().method() + ' ' + x.url().replace(/^.*\/api\/v1/, '').slice(0, 100) + ' ' + x.status()); }; page.on('response', on);
const paths = await page.$$eval('main svg path, main svg rect', ps => ps.map(p => { const b = p.getBoundingClientRect(); return [p.tagName, p.getAttribute('class') || '', Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height), p.getAttribute('fill') || ''].join(',') }).filter(s => !s.includes(',0,0,')));
res.paths = paths.slice(0, 30);
const bar = (await page.$$('main svg path, main svg rect')).filter(async () => true);
for (const p of await page.$$('main svg path, main svg rect')) { const b = await p.boundingBox(); const fill = await p.getAttribute('fill'); if (b && b.height > 100 && b.width < 100 && b.width > 10) { await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await sleep(800); res.tooltip = await page.evaluate(() => (document.querySelector('.recharts-tooltip-wrapper, [role=tooltip]') || {}).innerText || ''); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); res.clicked = b; break; } }
await sleep(3500);
await shot('s03-view-drill');
res.pop = await page.evaluate(() => [...document.querySelectorAll('[role=dialog], [role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).join(' || ').slice(0, 1500));
res.url = page.url().replace(H, '');
page.off('response', on); res.net = net.slice(-8);
return res;
