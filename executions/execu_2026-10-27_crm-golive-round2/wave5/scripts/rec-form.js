const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b';
await page.goto(H + '/modules/' + M, { waitUntil: 'domcontentloaded' }); await sleep(5000);
const btns = await page.$$eval('main button, main a', bs => bs.map(b => b.innerText.trim()).filter(t => t && t.length < 50));
const c = page.locator('main button, main a', { hasText: /^(Create|New)\b/ }).first();
await c.click().catch(() => {}); await sleep(4000);
await shot('rec-form');
const labels = await page.$$eval('label', ls => ls.map(l => l.innerText.trim()).filter(Boolean));
return { btns: [...new Set(btns)].slice(0, 30), url: page.url().replace(H, ''), labels: labels.slice(0, 40) };
