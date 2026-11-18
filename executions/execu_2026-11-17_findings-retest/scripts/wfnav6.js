await page.goto(H+'/settings/workflow-executions',{waitUntil:'commit'});await page.getByRole('row').nth(1).waitFor({timeout:150000}).catch(()=>{});await sleep(5000);
await shot('wf-executions-page.png');
const sel=await page.$$eval('[aria-current],[data-active=true],.active',as=>as.map(a=>a.innerText.trim().slice(0,40)));log('active nav',sel);
