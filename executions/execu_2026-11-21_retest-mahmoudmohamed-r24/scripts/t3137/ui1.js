await page.goto(H+'/views/all/tickets/784fd278-600f-4302-8ac0-7a681e8683a1',{waitUntil:'commit'});await sleep(12000);
const tab=page.getByRole('tab',{name:/History/i}).first(); if(await tab.count()) await tab.click(); else await page.getByText('History',{exact:true}).first().click().catch(()=>{});
await sleep(6000);await shot('3137-a-backlog-ticket-history.png');
const t=(await text()).replace(/\s+/g,' ');log(t.match(/.{0,200}(assign|Round|robin|owner).{0,200}/gi)?.slice(0,6));
await page.goto(H+'/settings',{waitUntil:'commit'});await sleep(10000);
const a=page.getByText(/Assignment Rules/i).first(); await a.click().catch(e=>log('noAR'));await sleep(8000);log(page.url());
await shot('3137-b-ar-page.png');
