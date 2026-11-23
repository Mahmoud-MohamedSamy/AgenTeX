const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/1b37d6b5-ba69-4c80-8590-6401cf8c665b',{waitUntil:'commit'});await page.getByText('QA RT25 W2 2997 seq t1').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
R.hc=await page.getByText('History',{exact:true}).count();if(R.hc){await page.getByText('History',{exact:true}).first().click();await sleep(7000);}
let t=await bt();const j=t.lastIndexOf('History');R.hist=t.slice(Math.max(0,j-100),j+2500);await shot('2997-r25-ticket-history.png',{fullPage:true});
await page.goto(H+'/settings/workflow-executions/939cac82-ac34-47b6-8fc7-46caca194826',{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
t=await bt();R.exec=t.slice(Math.max(0,t.indexOf('Back to history')),t.indexOf('Back to history')+1200);await shot('2997-r25-exec-run.png');
return R;
