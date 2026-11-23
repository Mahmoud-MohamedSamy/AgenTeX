const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings',{waitUntil:'commit'});await sleep(6000);await page.getByText('Global Sets',{exact:true}).first().click({timeout:15000});await sleep(5000);await page.getByPlaceholder(/search/i).last().fill('QA RT19 GS Tier');await sleep(3000);
let t=await bt();const k=t.indexOf('QA RT19 GS Tier');R.row=t.slice(k,k+200);await shot('crm-3090-a-list.png',{timeout:90000});
const row=page.locator('tr',{hasText:'QA RT19 GS Tier'}).first();const link=row.getByText('Leads',{exact:true}).first();R.linkText=await link.innerText().catch(()=>'-');await link.click({timeout:10000}).catch(e=>R.clickErr=e.message.slice(0,80));await sleep(9000);
t=await bt();const j=t.search(/Associated|Used in|Where/i);R.panel=t.slice(Math.max(0,j),j+700);await shot('crm-3089-a-used-in.png',{timeout:90000});
return R;
