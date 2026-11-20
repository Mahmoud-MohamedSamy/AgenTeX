const R={};const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(const [n,id,w] of [['3133-r1-a-1600','1545578e-f416-44b6-938d-861949dfba85',1600],['3133-r1-b-1280','1545578e-f416-44b6-938d-861949dfba85',1280],['3133-r1-c-one-action','bde10423-be28-43de-9bcf-0efe09cf374e',1600]]){
 await page.setViewportSize({width:w,height:900});await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:120000});await sleep(5000);
 const t=await bt();const i=t.indexOf('Outcome');R[n]={top:t.slice(i,i+180),acts:t.slice(t.indexOf('Dispatched'),t.indexOf('Dispatched')+420),fit:await page.evaluate(()=>{const tb=document.querySelector('table');const p=tb.parentElement;return {table:tb.scrollWidth,box:p.clientWidth,overflow:p.scrollWidth>p.clientWidth};})};await shot(n+'.png',{timeout:90000});}
await page.setViewportSize({width:1600,height:900});return R;
