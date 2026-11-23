module.exports=async(page)=>{const R={muts:[]};const RAW='../screenshots/raw/';const bt=async()=>(await page.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
page.on('request',q=>{if(!['GET','OPTIONS'].includes(q.method())&&/desk\.zoho\.com\/(api|supportapi)/.test(q.url()))R.muts.push(q.method()+' '+q.url().replace(/^https:\/\/[^/]+/,'').slice(0,100));});
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Web Forms?$/).first().click({timeout:20000}).catch(()=>{});await page.waitForTimeout(4000);await page.mouse.click(95,568);await page.waitForTimeout(25000);
await page.mouse.click(928,419);await page.waitForTimeout(12000);
await page.screenshot({path:RAW+'z2751-9b.png'});await page.mouse.click(734,411);await page.waitForTimeout(1500);
for(const [x,y,ty] of [[320,379,300],[304,423,380],[310,511,460]]){await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(700,ty,{steps:15});await page.mouse.move(900,ty+10,{steps:15});await page.mouse.up();await page.waitForTimeout(2000);}
await page.screenshot({path:RAW+'z2751-10.png'});
await page.mouse.click(1282,795);await page.waitForTimeout(8000);
let t='';for(const f of page.frames())t+=' | '+(await f.locator('body').innerText().catch(()=>'')).replace(/s+/g,' ');R.step2=t.replace(/^.*?Workstation/,'').slice(0,2000);await page.screenshot({path:RAW+'z2751-11.png'});return R;};
