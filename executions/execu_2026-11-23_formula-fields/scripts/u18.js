const ids = JSON.parse(fs.readFileSync(RUN + '/out/ui-ids.json', 'utf8'));
await page.goto(H + `/modules/${made.mod}/records/${ids.clone}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX UI DOUBLE/i.test(await text('main'))) break; } await sleep(1500);
await page.getByRole('button', { name: /Actions/ }).first().click(); await sleep(1200); const items = await page.getByRole('menuitem').allInnerTexts(); log('actions', items);
const cl = page.getByRole('menuitem').filter({ hasText: /clone/i }).first();
if (!(await cl.count())) { await page.keyboard.press('Escape'); const dots = page.locator('main button').filter({ has: page.locator('svg') }); const m = page.locator('button[aria-haspopup=menu]'); log('menus', await m.count()); for (let i = 0; i < await m.count(); i++) { await m.nth(i).click().catch(() => { }); await sleep(800); const it = await page.getByRole('menuitem').allInnerTexts(); if (it.some(x => /clone/i.test(x))) { log('clone in menu', i, it); break; } await page.keyboard.press('Escape'); } }
const c2 = page.getByRole('menuitem').filter({ hasText: /clone/i }).first();
if (await c2.count()) { await c2.click(); await sleep(4000); log('clone url', page.url()); await shot('H10-clone-form'); const t = await text('main'); log('form has formula', /QA FX UI Double/i.test(t), /Computed after save/.test(t));
  const nm = page.getByPlaceholder('Name').first(); await nm.fill('QA FX H10 clone'); await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(7000); log('after save', page.url());
  for (let i = 0; i < 20; i++) { if (/QA FX UI DOUBLE/i.test(await text('main'))) break; await sleep(1500); } const t2 = await text('main'); const i2 = t2.search(/QA FX UI DOUBLE/i); log('clone value', JSON.stringify(t2.slice(i2, i2 + 25))); fs.writeFileSync(RUN + '/out/h10-url.txt', page.url()); }
// I4 search
await page.goto(H + `/modules/${made.mod}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX/.test(await text('main'))) break; }
const s = page.getByPlaceholder(/search/i).last(); await s.fill('High value'); await s.press('Enter'); await sleep(5000); const t3 = await text('main'); log('I4 search "High value" finds D1?', /QA FX D1/.test(t3), 'rows text', t3.slice(0, 200).replace(/\n/g, ' | ')); await shot('I4-search');
