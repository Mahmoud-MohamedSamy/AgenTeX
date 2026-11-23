const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings',{waitUntil:'commit'});await page.getByText('Agents',{exact:true}).first().waitFor({timeout:120000});await page.getByText('Agents',{exact:true}).first().click();await sleep(6000);R.listUrl=page.url().replace(H,'');
await page.getByText('Customer Experience Specialists 2').first().click();await sleep(6000);R.url=page.url().replace(H,'');let t=await bt();
R.hits=[...new Set((t.match(/.{0,80}(ticket access|own tickets|unassigned|All tickets|Personal|Access type|View only|Full access).{0,100}/gi)||[]))].slice(0,8);
await shot('3098-r1-a-agent-page.png',{timeout:90000});
const tabs=await page.locator('[role=tab]').allInnerTexts();R.tabs=tabs;return R;
