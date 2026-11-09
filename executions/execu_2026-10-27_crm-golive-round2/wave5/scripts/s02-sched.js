await page.goto(H + '/reports', { waitUntil: 'domcontentloaded' }); await sleep(8000);
await page.locator('main button, main a, main [role=tab]', { hasText: /^Scheduled Reports$/ }).first().click(); await sleep(4000);
await shot('s02-scheduled');
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
const btns = await page.$$eval('main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean));
return { url: page.url().replace(H, ''), text: t.slice(0, 1500), btns: [...new Set(btns)].slice(0, 40) };
