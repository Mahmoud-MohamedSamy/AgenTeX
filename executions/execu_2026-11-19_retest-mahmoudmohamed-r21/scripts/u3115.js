const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(const [n,id,num] of [['3115-r1-a-5529-history','45419067-6cbe-4862-8ab2-77b1f1e51d93','#5529'],['3115-r1-b-5530-history','7a167813-530b-41c0-acb7-1b326943b7c9','#5530']]){
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText(num).first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
await page.getByText('History',{exact:true}).first().click();await sleep(7000);const t=await bt();const j=t.indexOf('Ticket History');R[n]=t.slice(j,j+1600);
R[n+'_count']={ownerChanged:(t.match(/Owner changed/gi)||[]).length,ticketOwnerWas:(t.match(/Ticket owner was changed|Ticket Owner was updated/gi)||[]).length,byRule:(t.match(/by workflow rule QA RT21 W2 3115 rapid/g)||[]).length};
await shot(n+'.png',{timeout:90000,fullPage:true});}
return R;
