await page.goto(H+'/views/all/tickets/32050fd4-4c9a-4181-a28a-13135ed417f4',{waitUntil:'domcontentloaded'});
await page.getByText(/K31/).first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
const f=page.locator('[data-rule-field=skills]');log('fields '+await f.count());
if(await f.count()){await f.first().scrollIntoViewIfNeeded();await sleep(800);log(await f.first().evaluate(e=>e.outerHTML.slice(0,1500)));}
else{const l=page.getByText(/^Skills$/);log('labels '+await l.count());for(let i=0;i<await l.count();i++){log(i+' '+JSON.stringify(await l.nth(i).boundingBox()));}}
await shot('2933-x-ticket-page.png');
