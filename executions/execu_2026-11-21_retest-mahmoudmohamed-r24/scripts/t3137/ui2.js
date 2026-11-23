await page.goto(H+'/views/all/tickets/784fd278-600f-4302-8ac0-7a681e8683a1',{waitUntil:'commit'});
await page.getByText('QA RT24 3137 A backlog').first().waitFor({timeout:120000}).catch(()=>log('no subject'));await sleep(4000);
await shot('3137-a0-backlog-ticket.png');
const tab=page.getByText(/^History$/).first(); await tab.click().catch(e=>log('nohist'));await sleep(6000);await shot('3137-a-backlog-ticket-history.png');
log((await text()).replace(/\s+/g,' ').slice(0,1500));
