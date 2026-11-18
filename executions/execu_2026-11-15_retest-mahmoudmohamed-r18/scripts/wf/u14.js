const id='28ff5c10-2e53-4102-9b7d-b01d2c065ff6';
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'domcontentloaded'});
await page.getByText('QA RT18 WF 3033 ticket').first().waitFor({timeout:90000}).catch(()=>{});await sleep(4000);
await page.getByRole('tab',{name:/History/i}).first().click().catch(()=>page.getByText('HISTORY',{exact:true}).first().click());await sleep(4000);
const hb=(await text()).replace(/\s+/g,' ');const j=hb.search(/QA RT18 Address/);log('hist',hb.slice(Math.max(0,j-300),j+700));
const el=page.getByText('QA RT18 Address').first();if(await el.count())await el.scrollIntoViewIfNeeded();
await shot('3033-2-history-two-parts.png');
return {raw:/\{"|"city"/.test(hb)};
