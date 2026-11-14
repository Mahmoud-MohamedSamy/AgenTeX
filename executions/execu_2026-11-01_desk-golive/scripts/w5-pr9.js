const t0 = Date.now(); await page.goto(H + '/views/all/tickets/f64e2ab2-83ae-4ec8-9441-ee94d302d8bd', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(1000); if ((await page.locator('body').innerText()).includes('#3403')) break; } out.load = (Date.now() - t0) / 1000;
await sleep(3000); const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.has = t.includes('QA GL W5 Product'); const i = t.indexOf('Product'); out.ctx = i > 0 ? t.slice(i - 50, i + 150) : 'no Product label';
await shot('w5/W5-60-ticket-product');
return fin({ out });
