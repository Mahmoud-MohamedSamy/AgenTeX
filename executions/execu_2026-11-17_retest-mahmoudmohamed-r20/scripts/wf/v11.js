const main=()=>page.locator('main').last();const R={};
for(const [n,id] of [['2997-1-exec-run1-bg','0ef14c02-e73a-4e8e-b658-886ce2d07f00'],['2997-2-exec-run2-refire','241cd131-d602-469b-9430-14acfc65c61a']]){await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:90000}).catch(()=>{});await sleep(4000);const t=(await main().innerText()).replace(/\s+/g,' ');const i=t.indexOf('Back to history');R[n]=t.slice(i,i+700);await shot(n+'.png');}
await page.goto(H+'/views/all/tickets/2609f288-3c1f-45e9-a32c-ea4123b63bcb',{waitUntil:'commit'});await page.getByText('QA RT20 WF 2997 seq t2').first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
const tt=(await page.locator('body').innerText()).replace(/\s+/g,' ');const j=tt.indexOf('Ticket Owner');R.ticket=tt.slice(Math.max(0,j-50),j+150);await shot('2997-3-ticket-owner.png');
return R;
