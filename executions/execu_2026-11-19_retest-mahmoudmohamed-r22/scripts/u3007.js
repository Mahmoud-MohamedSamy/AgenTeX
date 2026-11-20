const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/99728d5a-748a-4e4a-a171-4a4e9d641a0c',{waitUntil:'commit'});await page.getByText('QA RT22 3007 customer question').first().waitFor({timeout:120000});await sleep(6000);
let t=await bt();R.forum=[...new Set(t.match(/.{0,50}(Forum|Community|forum|topic).{0,100}/g)||[])].slice(0,6);await shot('3007-r1-a-ticket.png',{timeout:90000});
const arrow=page.getByRole('button',{name:/Reply All/}).first().locator('xpath=following-sibling::button[1]');if(await arrow.count()){await arrow.click();await sleep(1200);R.replyMenu=(await page.locator('[role=menuitem]').allInnerTexts()).map(s=>s.trim());await shot('3007-r1-b-reply-menu.png',{timeout:90000});await page.keyboard.press('Escape');}
await page.getByRole('button',{name:/Reply All/}).first().click();await sleep(2500);t=await bt();R.composer=(t.match(/.{0,40}(From|Recipients|Post to|Forum|Community).{0,120}/g)||[]).slice(0,4);await shot('3007-r1-c-composer.png',{timeout:90000});
return R;
