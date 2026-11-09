await sleep(2000);
const res = {};
res.text = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 400);
res.inputs = await page.$$eval('main input', is => is.map(i => (i.getAttribute('aria-label') || i.placeholder) + '=' + i.value));
res.btns = [...new Set(await page.$$eval('main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean)))].slice(0, 30);
const a = page.locator('main button[aria-label*="actions" i], main button[aria-label="More"]').first();
if (await a.count()) { await a.click(); await sleep(1000); res.menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || ')); await page.keyboard.press('Escape'); }
await shot('s02-joined-view');
return res;
