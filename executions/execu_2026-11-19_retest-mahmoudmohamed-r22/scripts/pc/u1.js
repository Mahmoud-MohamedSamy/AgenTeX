const id='669236bc-1180-4440-af4a-c5c3d7a2dd0e';
for(let a=0;a<3;a++){await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});const ok=await page.getByText(/QA RT20 PC/).first().waitFor({timeout:90000}).then(()=>1,()=>0);if(ok)break;}
await sleep(6000);const h=page.getByText(/^HISTORY$/i).first();await h.click().catch(()=>{});await sleep(6000);await shot('3076-1-after-delete-assigned-history.png');
log(((await text()).match(/[^\n]*(round|assign|owner)[^\n]*/gi)||[]).slice(0,12).join(' || ').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g,'<email>'));
