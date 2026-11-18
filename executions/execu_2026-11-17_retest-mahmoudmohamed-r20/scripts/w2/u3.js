const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(const [n,id] of [['3058-r2-13-exec-create','a1a1132c-a2a2-4bb3-9805-61755ee5e9a5'],['3058-r2-14-exec-remove','234ce954-2c7b-4dd9-a559-1bfa22d63ff8'],['3058-r2-15-exec-wrong','8b52960a-7210-48e9-ab07-5e3444eb262b']]){
await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:90000}).catch(()=>{});await sleep(4000);
const t=await bt();R[n]=t.slice(t.indexOf('Dispatched'),t.indexOf('Dispatched')+300);await shot(n+'.png',{timeout:90000});}
await page.goto(H+'/views/all/tickets/a45f0db3-5a69-461e-b70b-fcbfa6f184a7',{waitUntil:'commit'});await page.getByText('QA RT20 W2 3058 wrong qao').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
let t=await bt();R.wrongTicket=t.slice(t.indexOf('Tags ('),t.indexOf('Tags (')+60);R.wnum=(t.match(/#\d{4}/)||[])[0];await shot('3058-r2-16-wrong-ticket-tags.png',{timeout:90000});
await page.goto(H+'/views/all/tickets/d83c8c58-7531-46a0-8571-b7bbbfe35605',{waitUntil:'commit'});await page.getByText('QA RT20 W2 3058 one create flow').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
await page.getByText('History',{exact:true}).first().click();await sleep(6000);t=await bt();const j=t.indexOf('Ticket History');R.hist=t.slice(j,j+1200);await shot('3058-r2-17-ticket-history.png',{timeout:90000});
return R;
