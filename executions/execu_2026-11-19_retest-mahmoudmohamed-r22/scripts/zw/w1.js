module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';const bt=async()=>(await page.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup/landing',{waitUntil:'commit'});await page.waitForTimeout(12000);R.u1=page.url().replace(/^https:\/\/[^/]+/,'');
let t=await bt();R.hasWF=/Web Forms?/i.test(t);await page.screenshot({path:RAW+'z2751-0.png'});
const s=page.getByPlaceholder(/Search/i).first();if(await s.count()){await s.fill('web form');await page.waitForTimeout(3000);}
t=await bt();R.search=(t.match(/.{0,40}Web.?Form.{0,60}/gi)||[]).slice(0,6);await page.screenshot({path:RAW+'z2751-1.png'});return R;};
