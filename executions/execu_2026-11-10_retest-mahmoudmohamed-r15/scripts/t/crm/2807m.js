const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + '/modules/'+L+'/mass-delete', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Build criteria/i.test(await text())) break; }
await sleep(2000);
await page.getByText('Select a field', {exact:true}).click(); await sleep(1500); log('after field click', (await page.$$eval('[role=option], [role=listbox] *', os => os.slice(0,8).map(x=>x.innerText.trim()))));
await page.keyboard.type('Last Name'); await sleep(1200);
const o = page.getByRole('option', {name:/^Last Name$/}); log('opt', await o.count()); if (await o.count()) await o.first().click(); else await page.getByText('Last Name', {exact:true}).last().click();
await sleep(1000);
await shot('NDC-2807-md-field.png'); log('row', await page.locator('main').innerText().then(s=>s.slice(0,300))); const hp = page.locator('main button[aria-haspopup], main [role=combobox]'); log('hp', await hp.count(), await hp.allInnerTexts()); await hp.nth(1).click(); await sleep(1000);
const ops = await page.$$eval('[role=option]', os => os.map(x=>x.innerText.trim())); log('ops', ops);
const so = page.getByRole('option', {name:/starts with/i}); if (await so.count()) await so.first().click(); else await page.getByText(/starts with/i).last().click();
await sleep(1000);
const inp = page.locator('main input[type=text], main input:not([type])').last(); await inp.fill('2807 '); await sleep(500);
await shot('NDC-2807-md-criteria.png');
await page.getByRole('button', {name:'Search', exact:true}).last().click(); await sleep(8000);
const t = await text(); const k = t.search(/match|records? found|to delete/i); log('preview', t.slice(Math.max(0,k-300), k+500));
await shot('NDC-2807-md-preview.png');
const btns = await page.$$eval('main button', bs => bs.map(b=>b.innerText.trim()).filter(Boolean)); log(btns.slice(-15));
