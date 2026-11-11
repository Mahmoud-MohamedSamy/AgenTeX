const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V='800057b7-6125-4d18-9fb7-1c295d98e5b7';
await page.goto(H + '/modules/'+L+'?view='+V, { waitUntil: 'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('tbody tr')).length > 5) break; }
await sleep(2000);
await page.locator('thead input[type=checkbox]').first().check(); await sleep(1500); await page.getByRole('button', {name:'Module actions'}).click(); await sleep(1200);
await page.getByRole('menuitem', {name:'Mass Update'}).click(); await sleep(4000);
log(page.url()); const d = page.locator('[role=dialog]').last(); log((await d.innerText().catch(()=>'')).slice(0,1500) || (await text()).slice(-1500));
await shot('NDC-2807-massupdate-open.png');
