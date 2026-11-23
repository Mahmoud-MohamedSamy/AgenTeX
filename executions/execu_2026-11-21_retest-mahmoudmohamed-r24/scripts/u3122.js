const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/902a9bc5-56a9-4061-9694-01d9291f6f32',{waitUntil:'commit'});await page.getByText('QA RT22 BS 3122 clone source').first().waitFor({timeout:120000});await page.getByText('QA RT22 BS 3122 clone source').first().click();await sleep(7000);
let t=await bt();R.srcOwner=(t.match(/Ticket Owner.{0,60}/)||[])[0];
await shot('3122-r1-z2.png',{timeout:60000});R.srcPane=(await bt()).match(/QA RT22 BS 3122 clone source.{0,300}/g)?.slice(-1)[0];await page.mouse.click(1570,103);await sleep(1200);R.menu=(await page.locator('[role=menuitem]').allInnerTexts()).slice(0,14);await page.getByRole('menuitem',{name:/^Clone/}).first().click({timeout:10000});await sleep(4000);
t=await bt();R.formOwner=(t.match(/Ticket Owner.{0,50}/)||[])[0];await shot('3122-r1-a-clone-form.png',{timeout:90000});
await page.getByRole('button',{name:'Save',exact:true}).first().click({timeout:15000});await sleep(6000);R.cloneUrl=page.url().replace(H,'');t=await bt();R.cloneOwner=(t.match(/Ticket Owner.{0,60}/)||[])[0];R.num=(t.match(/#57\d\d/g)||[]).slice(0,3);await shot('3122-r1-b-clone-saved.png',{timeout:90000});
return R;
