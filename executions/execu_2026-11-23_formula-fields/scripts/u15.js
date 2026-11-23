await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Checks/.test(await text())) break; } await sleep(2000);
const l = page.getByText('QA FX UI Double', { exact: true }).first(); const b = await l.boundingBox(); await page.mouse.move(b.x + 300, b.y + 5); await sleep(800);
const vis = await page.locator('button:visible').evaluateAll(bs => bs.map(x => { const r = x.getBoundingClientRect(); return { t: (x.getAttribute('aria-label') || x.title || x.innerText || '').trim().slice(0, 30), x: Math.round(r.x), y: Math.round(r.y) }; }).filter(o => o.y > 270 && o.y < 330));
log('buttons near field', vis); await shot('hover-field');
