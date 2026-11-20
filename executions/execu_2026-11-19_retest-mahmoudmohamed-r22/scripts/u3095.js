const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all',{waitUntil:'commit'});await sleep(6000);await page.getByText('All Tickets').first().click();await sleep(8000);R.url=page.url().replace(H,'');let t=await bt();
const k=t.indexOf('QA RT22 BS 3124 no contact api');R.row=k>=0?t.slice(k-50,k+250):t.slice(0,300);await shot('3095-r1-a-list.png',{timeout:90000});
R.viewBtns=(await page.locator('button[aria-label*="view" i], [role=tab]').allInnerTexts().catch(()=>[])).slice(0,8);return R;
