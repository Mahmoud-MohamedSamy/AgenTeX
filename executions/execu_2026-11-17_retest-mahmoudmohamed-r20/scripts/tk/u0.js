await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await sleep(12000);
log(page.url());
await page.getByText('All records',{exact:true}).first().click().catch(e=>log('c',e.message.slice(0,100)));await sleep(10000);
log(page.url());
await shot('tk-explore-list.png');
log((await text()).replace(/\s+/g,' ').slice(0,2500));
