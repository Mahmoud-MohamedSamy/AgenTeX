const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + `/settings/modules-and-fields/${L}/layouts/new`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Basic Information|System Information/.test(await txt().catch(() => ''))) break; } await sleep(2500);
const fields = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e => e.childElementCount === 0 && e.getBoundingClientRect().left > 360 && e.getBoundingClientRect().left < 560 && e.textContent.trim()).map(e => e.textContent.trim()).slice(0, 25));
await page.mouse.click(357, 82); await sleep(1500);
const vis = await page.evaluate(() => [...document.querySelectorAll('input, textarea')].filter(i => i.offsetParent).map(i => (i.getAttribute('aria-label') || i.placeholder || i.name) + '=' + i.value));
const panel = await page.evaluate(() => (document.querySelector('[role=dialog]') || {}).innerText?.slice(0, 300) || null);
await shot('1335-04-layout-settings');
return done({ url: page.url().replace(H, ''), fields, vis, panel });
