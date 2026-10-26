await page.goto(H + '/', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/CRM Teamspace|QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const sw = page.getByRole('button', { name: /CRM Teamspace/ }).first(); await sw.click(); await sleep(1000);
const opts = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=option],[role=menuitemradio]')].map(e => e.innerText.trim()));
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]').filter({ hasText: 'QA RT TS' }).first().click(); await sleep(2500);
const nav = await page.evaluate(() => { const n = document.querySelector('nav.sidebar-scroll') || document.querySelector('nav'); return n ? n.innerText.split('\n').map(s => s.trim()).filter(Boolean) : []; });
await shot('1695-02-left-nav');
return done({ opts, nav: nav.slice(0, 40) });
