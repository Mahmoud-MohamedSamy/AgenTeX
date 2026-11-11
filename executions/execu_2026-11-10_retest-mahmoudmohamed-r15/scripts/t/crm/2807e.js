const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='800057b7-6125-4d18-9fb7-1c295d98e5b7';
await page.goto(H + '/modules/'+L+'?view='+V, { waitUntil: 'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('tbody tr')).length > 5) break; }
await sleep(2000);
await page.locator('thead input[type=checkbox]').first().check(); await sleep(1500);
await page.getByText('100 selected').click(); await sleep(1500);
let items = await page.$$eval('[role=menuitem], [role=menu] button, [role=dialog] button', bs => bs.map(b=>b.innerText.trim()).filter(Boolean)); log('chip menu', items); await shot('NDC-2807-chip.png');
await page.keyboard.press('Escape'); await sleep(500);
await page.getByRole('button', {name:'Module actions'}).click(); await sleep(1500);
items = await page.$$eval('[role=menuitem]', bs => bs.map(b=>b.innerText.trim())); log('module actions', items); await shot('NDC-2807-module-actions.png');
