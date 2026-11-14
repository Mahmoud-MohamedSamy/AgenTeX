await page.goto(H+'/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByText('Standard',{exact:true}).first().click(); await sleep(10000); log('url',page.url());
const tile=page.locator('text="Pick List"').first(); const target=page.locator('text="Company"').first();
await tile.dragTo(target,{targetPosition:{x:20,y:5}}); await sleep(3000);
await shot('2865-1-dropped.png');
const t=await text(); log('toast', (t.match(/Named "[^"]+"[^\n]*/)||[''])[0]);
const name=(t.match(/Named "([^"]+)"/)||[])[1]; log('new field', name);
return {name};
