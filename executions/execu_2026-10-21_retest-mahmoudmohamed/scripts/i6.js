const r = await page.evaluate(() => { window.scrollTo(0, 600); const y = window.scrollY; const bo = getComputedStyle(document.body).overflowY, ho = getComputedStyle(document.documentElement).overflowY; window.scrollTo(0, 0); return { y, bo, ho }; });
await shot('1333-02-top');
// wheel over the main content and over the page header area
const content = page.locator('div.flex-1.min-w-0.min-h-0.overflow-y-auto').first();
const box = await content.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + 200); await page.mouse.wheel(0, 900); await sleep(800);
const a = await page.evaluate(() => ({ win: window.scrollY, inner: document.querySelector('div.flex-1.min-w-0.min-h-0.overflow-y-auto').scrollTop }));
await shot('1333-03-after-wheel-content');
// wheel with pointer over the Additional users list
const au = page.getByText('Additional users', { exact: true }).first(); await au.scrollIntoViewIfNeeded(); const ab = await au.boundingBox();
await page.mouse.move(ab.x + 100, ab.y + 150); await page.mouse.wheel(0, 300); await sleep(800);
const b = await page.evaluate(() => ({ win: window.scrollY, inner: document.querySelector('div.flex-1.min-w-0.min-h-0.overflow-y-auto').scrollTop }));
// inner scrollables inside the users/profiles lists
const innerLists = await page.evaluate(() => [...document.querySelectorAll('div.flex-1.min-w-0.min-h-0.overflow-y-auto *')].filter(e => { const s = getComputedStyle(e); return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 2; }).length);
await shot('1333-04-users-area');
return done({ r, a, b, innerLists });
