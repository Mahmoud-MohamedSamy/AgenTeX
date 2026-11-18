await page.goto(H+'/settings/users-control/teams',{waitUntil:'domcontentloaded'}); await sleep(9000);
await page.getByText('QA RT21 AC Light Team').first().click().catch(e=>log('noclick')); await sleep(5000);
log((await text()).replace(/\s+/g,' ').slice(0,1200)); await shot('A3-1-team.png');
await page.goto(H+'/views/all/tickets/996816b8-3cfe-4292-bc26-cd21e9d91fc3',{waitUntil:'domcontentloaded'}); await sleep(9000); await shot('A3-2-ticket.png');
const t=await text(); const i=t.indexOf('Team'); log('tk',t.slice(Math.max(0,i-200),i+300).replace(/\s+/g,' '));
