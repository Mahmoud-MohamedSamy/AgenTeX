const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + '/modules/'+L+'/mass-delete', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Build criteria/i.test(await text())) break; }
await sleep(2000);
await page.getByText('Select a field', {exact:true}).click(); await sleep(1500); log('after field click', (await page.$$eval('[role=option], [role=listbox] *', os => os.slice(0,8).map(x=>x.innerText.trim()))));
await page.keyboard.type('Last Name'); await sleep(1200);
const o = page.getByRole('option', {name:/^Last Name$/}); log('opt', await o.count()); if (await o.count()) await o.first().click(); else await page.getByText('Last Name', {exact:true}).last().click();
await sleep(1000);
await shot('2807-md-field.png'); log('row', await page.locator('main').innerText().then(s=>s.slice(0,300))); const hp = page.locator('main button[aria-haspopup], main [role=combobox]'); log('hp', await hp.count(), await hp.allInnerTexts()); await hp.nth(1).click(); await sleep(1000);
const ops = await page.$$eval('[role=option]', os => os.map(x=>x.innerText.trim())); log('ops', ops);
const so = page.getByRole('option', {name:/starts with/i}); if (await so.count()) await so.first().click(); else await page.getByText(/starts with/i).last().click();
await sleep(1000);
const inp = page.locator('main input[type=text], main input:not([type])').last(); await inp.fill('2807 '); await sleep(500);
await shot('2807-md-criteria.png');
await page.getByRole('button', {name:'Search', exact:true}).last().click(); await sleep(8000);
const t = await text(); const k = t.search(/match|records? found|to delete/i); log('preview', t.slice(Math.max(0,k-300), k+500));
await shot('2807-md-preview.png'); if (!/Total Records:\s*200\b/.test(t)) { log('ABORT preview not 200'); return {abort:true}; }
const jobs=[]; const t0=Date.now(); page.on('response', async r => { const u=r.url(); if (/mass-delete/.test(u)) { let b=''; try{ b=(await r.text()).slice(0,300);}catch(e){} jobs.push('+'+(Date.now()-t0)+'ms '+r.request().method()+' '+r.status()+' '+u.replace(/^https:\/\/[^/]+/,'').slice(0,110)+' '+b); } });
await page.locator('main thead input[type=checkbox]').first().click(); await sleep(2000);
let t2 = await text(); log('selected', (t2.match(/\d+ records? selected[^\n]*|Select all[^\n]*/gi)||[]).join(' / '));
const sa = page.getByText(/Select all \d+/i); if (await sa.count()) { await sa.first().click(); await sleep(1500); t2 = await text(); log('selected2', (t2.match(/\d+ records? selected[^\n]*/gi)||[]).join(' / ')); }
await shot('2807-md-selected.png');
await page.getByRole('button', {name:'Delete', exact:true}).first().click(); await sleep(2000);
const dlg = page.locator('[role=dialog], [role=alertdialog]').last(); log('confirm', (await dlg.innerText().catch(()=>'none')).replace(/\n/g,' | ').slice(0,400)); await shot('2807-md-confirm.png');
const typeBox = dlg.locator('input'); if (await typeBox.count()) { await typeBox.first().fill('DELETE'); await sleep(500); }
await dlg.getByRole('button', {name:/^(Delete|Confirm|Delete records|Yes)/}).last().click(); await sleep(4000);
await shot('2807-md-running.png'); log('running text', ((await text()).match(/(Deleting[^\n]*|\d+ of \d+[^\n]*)/i)||[''])[0]);
await page.goto(H + '/', { waitUntil: 'commit' }); log('left with full navigation +'+(Date.now()-t0)); await sleep(4000);
log('url after leave', page.url()); await shot('2807-md-left.png'); log('toast on home', ((await text()).match(/(Mass delete[^\n]*|Deleting[^\n]*|\d+ of \d+ done[^\n]*)/i)||[''])[0]);
await sleep(60000); await shot('2807-md-home-60s.png'); log('toast 60s', ((await text()).match(/(Mass delete[^\n]*|Deleting[^\n]*|\d+ of \d+ done[^\n]*|deleted[^\n]*)/i)||[''])[0]);
log(jobs.slice(0,12));
