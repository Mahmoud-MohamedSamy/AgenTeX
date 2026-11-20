const T=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/out/3124.json','utf8'));const R={};
const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
const conv=async(id,num,n)=>{await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText(num).first().waitFor({timeout:120000});await sleep(5000);const t=await bt();const k=t.indexOf('CONVERSATION');R[n]=t.slice(k,k+260);await shot(n+'.png',{timeout:90000});};
await conv(T.id,'#'+T.n,'3124-r1-a-api');
await page.getByRole('button',{name:/^More|options|⋮/i}).last().click().catch(async()=>{await page.mouse.click(1570,100);});await sleep(1200);R.menu=(await page.locator('[role=menuitem]').allInnerTexts()).map(s=>s.trim()).slice(0,12);
const cl=page.getByRole('menuitem',{name:/^Clone/}).first();if(await cl.count()){await cl.click();await sleep(4000);const sv=page.getByRole('button',{name:'Save',exact:true}).first();await sv.click({timeout:15000});await sleep(6000);R.cloneUrl=page.url().replace(H,'');const t=await bt();const k=t.indexOf('CONVERSATION');R.clone=t.slice(Math.max(0,k-200),k+260);await shot('3124-r1-b-clone.png',{timeout:90000});}

return R;
