await page.goto(H+'/views/all/tickets/7a167813-530b-41c0-acb7-1b326943b7c9',{waitUntil:'commit'});await page.getByText('#5530').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
await page.getByText('History',{exact:true}).first().click();await sleep(7000);
await page.getByText('Owner changed').last().scrollIntoViewIfNeeded();await sleep(1500);await shot('3115-r1-c-5530-bg-owner.png',{timeout:90000});
const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');const k=t.lastIndexOf('Owner changed');return t.slice(k-60,k+200);
