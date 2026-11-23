const ids = JSON.parse(fs.readFileSync(RUN + '/out/ui-ids.json', 'utf8'));
await page.goto(H + `/modules/${made.mod}/records/${ids.clone}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX UI DOUBLE/i.test(await text('main'))) break; } await sleep(1500);
await page.mouse.click(1530, 122); await sleep(1500); const items = (await page.getByRole('menuitem').allInnerTexts()).map(s => s.trim()); log('header menu', items); await shot('H10-menu');
const cl = page.getByRole('menuitem').filter({ hasText: /clone/i }).first();
if (await cl.count()) { await cl.click(); await sleep(5000); log('url', page.url()); const t = await text('main'); log('form: formula locked', /Computed after save/.test(t)); await shot('H10-clone-form');
  const nm = page.getByPlaceholder('Name').first(); await nm.fill('QA FX H10 clone'); await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(7000);
  for (let i = 0; i < 20; i++) { if (/QA FX UI DOUBLE/i.test(await text('main'))) break; await sleep(1500); } const t2 = await text('main'); const i2 = t2.search(/QA FX UI DOUBLE/i); log('clone record', page.url(), JSON.stringify(t2.slice(i2, i2 + 25))); fs.writeFileSync(RUN + '/out/h10-url.txt', page.url()); }
