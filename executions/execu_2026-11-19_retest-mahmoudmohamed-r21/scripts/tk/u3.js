await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Classic View'}).waitFor({timeout:200000});await sleep(3000);
const lk=page.getByText('QA RT20 TK 3055 view',{exact:true}).first();await lk.scrollIntoViewIfNeeded();await sleep(1500);
const row=(await lk.locator('xpath=..').innerText().catch(()=>'')).replace(/\s+/g,' ');log('sidebar row',row);
await page.goto(H+'/settings/data/recycle-bin',{waitUntil:'domcontentloaded'});await sleep(15000);
log(page.url());log((await mtxt()).slice(0,900));await shot('3055-6-recycle-bin.png');
