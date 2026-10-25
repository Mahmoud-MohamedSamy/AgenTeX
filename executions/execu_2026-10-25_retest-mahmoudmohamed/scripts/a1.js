const C = '6f553963-01d6-4b68-9fb3-143d23044c41';
await page.goto(H + `/modules/${C}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/\d+ records/.test(await txt().catch(() => ''))) break; }
await page.getByRole('button', { name: /EN|language/i }).first().click(); await sleep(1000);
const opts = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=menuitemradio],[role=option]')].map(e => e.innerText.trim()));
const ar = page.getByRole('menuitemradio', { name: /العربية|Arabic/ }).or(page.getByRole('menuitem', { name: /العربية|Arabic/ })).or(page.getByRole('option', { name: /العربية|Arabic/ })).first();
await ar.click(); await sleep(4000);
const dir = await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang);
return done({ opts, dir });
