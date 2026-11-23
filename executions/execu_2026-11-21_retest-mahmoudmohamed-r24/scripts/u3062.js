const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets',{waitUntil:'commit'});await page.getByText('All Tickets').first().waitFor({timeout:120000});await sleep(3000);
R.btns=await page.locator('header button, nav button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText||'').trim()).filter(Boolean).slice(0,15));
const plus=page.locator('button[aria-label*="New" i], button[aria-label*="Create" i], button[aria-label*="Add" i]').first();R.plus=await plus.count();if(R.plus){await plus.click();await sleep(2000);await page.getByRole('menuitem',{name:'Ticket',exact:true}).click();await sleep(5000);R.url=page.url().replace(H,'');R.text=(await bt()).slice(0,900);}
await shot('3062-r1-dbg-new.png',{timeout:90000});return R;
