const id='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H+'/modules/'+id, { waitUntil:'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if (/records/.test(await text())) break; } await sleep(3000);
await page.getByText('Choose a view', {exact:true}).first().click(); await sleep(3000);
await shot('NDC-2136-leads-chooser.png');
const items = await page.$$eval('[role=option], [role=menuitem], [role=listbox] li, [cmdk-item]', os => os.map(o=>o.innerText.trim()).slice(0,40)); log(items);
