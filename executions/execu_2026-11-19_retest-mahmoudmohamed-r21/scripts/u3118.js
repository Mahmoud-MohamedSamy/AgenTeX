const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(const [n,id,num] of [['3118-r1-a-5118-onhold','7bec7744-755c-48bc-932f-6d3d5ce2191f','#5118'],['3118-r1-b-5117-escalated','5c68004d-860c-4bcd-b6b8-77e0bce5c044','#5117']]){
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText(num).first().waitFor({timeout:90000}).catch(()=>{});await sleep(8000);
const t=await bt();const i=t.indexOf('Steps');R[n]={steps:t.slice(i,i+400)};await shot(n+'.png',{timeout:90000});}
return R;
