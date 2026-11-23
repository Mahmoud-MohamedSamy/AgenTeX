module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';const bt=async()=>(await page.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);R.u=page.url().replace(/^https:\/\/[^/]+/,'');
let t=await bt();R.chan=(t.match(/.{0,80}(Channels|Web Forms|Web Form).{0,120}/g)||[]).slice(0,4);await page.screenshot({path:RAW+'z2751-2.png'});
const wf=page.getByText(/^Web Forms?$/).first();R.wf=await wf.count();if(R.wf){await wf.click();await page.waitForTimeout(8000);R.u2=page.url().replace(/^https:\/\/[^/]+/,'');t=await bt();R.page=t.slice(0,1200);await page.screenshot({path:RAW+'z2751-3.png'});}
return R;};
