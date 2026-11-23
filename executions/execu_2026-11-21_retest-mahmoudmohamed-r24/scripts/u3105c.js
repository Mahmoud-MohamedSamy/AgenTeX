const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(const [n,id] of [['3105-r1-e-run-all-failed','bde10423-be28-43de-9bcf-0efe09cf374e'],['3105-r1-f-run-partly-failed','1545578e-f416-44b6-938d-861949dfba85']]){
await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
const t=await bt();const i=t.indexOf('Back to history');R[n]=t.slice(i,i+700);R[n+'_overflow']=await page.evaluate(()=>{const tb=document.querySelector('table');if(!tb)return 'no table';const p=tb.parentElement;return {table:tb.scrollWidth,box:p.clientWidth,scroll:p.scrollWidth>p.clientWidth};});await shot(n+'.png',{timeout:90000});}
await page.goto(H+'/settings/workflow-executions?outcome=failed',{waitUntil:'commit'});await sleep(9000);const t=await bt();const i=t.indexOf('When Rule');R.list=t.slice(i,i+500);await shot('3105-r1-g-failed-only-new.png',{timeout:90000});
// find a4abbbac by paging the failed list
return R;
