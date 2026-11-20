const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/workflow-executions/134f329a-26ea-4e3b-916e-6ad193c1b7e0',{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
let t=await bt();R.exec=t.slice(Math.max(0,t.indexOf('Back to history')),t.indexOf('Back to history')+900);await shot('2997-r2-exec-bg-run.png');
await page.goto(H+'/views/all/tickets/da96e91b-3f0c-4c56-a4ba-7fb13a52055a',{waitUntil:'commit'});await page.getByText('QA RT20 W2 2997 rapid t1').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
R.hc=await page.getByText('History',{exact:true}).count();if(R.hc){await page.getByText('History',{exact:true}).first().click();await sleep(6000);}
t=await bt();const j=t.lastIndexOf('History');R.hist=t.slice(Math.max(0,j-100),j+1500);await shot('2997-r2-ticket-history.png');
return R;
