const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(const [n,id] of [['3110-r1-exec-wrong','36d36bc5-9617-4866-8039-c76e80cd541a'],['3110-r1-exec-delayed','cf6c766e-8a6c-46b6-9f03-d5f1b9bb10c1'],['3110-r1-exec-delayed-first','88eb2c3d-c3f4-4092-af9d-f5470c763f14'],['3110-r1-exec-mix','3aead83b-0e73-412c-8b6c-22fc223fa642'],['3110-r1-exec-remove','ad7fe497-3c0b-4c5b-b1fd-b9f9464b2d2c']]){
await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:90000}).catch(()=>{});await sleep(4000);
const t=await bt();const i=t.indexOf('Dispatched');R[n]=t.slice(i,i+400);await shot(n+'.png',{timeout:90000});}
await page.goto(H+'/views/all/tickets/a8c7f21a-2b75-4ed2-a1c5-092c97dfaaab',{waitUntil:'commit'});await page.getByText('QA RT20 W2 3110 wrong qao').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
let t=await bt();R.wrongTicket=t.slice(t.indexOf('Tags ('),t.indexOf('Tags (')+60);R.wnum=(t.match(/#\d{4}/)||[])[0];await shot('3110-r1-wrong-ticket-tags.png',{timeout:90000});
await page.goto(H+'/settings/workflow-executions',{waitUntil:'commit'});await sleep(9000);t=await bt();const k=t.indexOf('3110');R.list=t.slice(Math.max(0,k-200),k+900);await shot('3110-r1-exec-list.png',{timeout:90000});
return R;
