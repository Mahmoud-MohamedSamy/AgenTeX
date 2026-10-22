const content = page.locator('div.flex-1.min-w-0.min-h-0.overflow-y-auto').first();
const box = await content.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + 300);
for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 800); await sleep(500); }
const a = await page.evaluate(() => ({ win: window.scrollY, inner: document.querySelector('div.flex-1.min-w-0.min-h-0.overflow-y-auto').scrollTop, docH: document.documentElement.scrollHeight, vw: window.innerWidth, cw: document.documentElement.clientWidth }));
await shot('1333-05-chained');
// what makes the document tall?
const tall = await page.evaluate(() => [...document.body.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom + window.scrollY > 1500 && getComputedStyle(e).position !== 'static'; }).slice(0, 5).map(e => e.tagName + '.' + (e.className || '').toString().slice(0, 60) + ' bottom=' + Math.round(e.getBoundingClientRect().bottom + window.scrollY)));
return done({ a, scrollbarWidth: a.vw - a.cw, tall });
