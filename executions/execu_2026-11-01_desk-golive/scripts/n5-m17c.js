const o = {};
const row = page.locator('tr', { hasText: 'QA NDC ADM' }).first(); o.rows = await row.count();
o.btns = await row.locator('button').evaluateAll(bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()));
const more = row.locator('button').last(); await more.click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500);
o.menu = await page.$$eval('[role=menuitem]', es => es.map(e => e.innerText.trim()));
o.shot = await shot('m17/tavi-adm-menu');
return JSON.stringify(o);
