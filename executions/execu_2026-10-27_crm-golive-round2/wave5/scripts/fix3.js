const res = {};
const info = await page.$$eval('main button', bs => bs.map((b, i) => i + '|' + (b.getAttribute('aria-label') || '') + '|' + (b.getAttribute('title') || '') + '|' + b.innerText.trim().slice(0, 30) + '|' + JSON.stringify(b.getBoundingClientRect()).slice(0, 60)));
res.info = info.slice(0, 12);
const idx = info.findIndex(x => /More actions/.test(x));
if (idx >= 0) { const b = (await page.$$('main button'))[idx]; await b.click({ force: true }); await sleep(1500); res.menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu], [role=menuitem], [data-radix-popper-content-wrapper]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || ').slice(0, 800)); await shot('s03-more-actions'); await page.keyboard.press('Escape'); }
return res;
