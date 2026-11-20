await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Classic View'}).waitFor({timeout:200000});await sleep(2000);
const lk=page.getByText('QA RT20 TK 3055 view',{exact:true}).first();await lk.scrollIntoViewIfNeeded();await lk.click();await sleep(10000);
log(page.url());log((await mtxt()).slice(0,700));
await shot('3055-0-view.png');
const cbs=page.getByRole('checkbox');log('checkboxes',await cbs.count());
await cbs.first().click();await sleep(2000);
log('after tick',(await mtxt()).slice(0,500));
await shot('3055-0-ticked.png');
