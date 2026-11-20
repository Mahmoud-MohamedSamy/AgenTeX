module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';const bt=async()=>(await page.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText(/^Web Forms?$/).first().click();await page.waitForTimeout(4000);
await page.getByText(/^Advanced Web Form$/).first().click();await page.waitForTimeout(9000);R.u=page.url().replace(/^https:\/\/[^/]+/,'');
let t=await bt();const i=t.indexOf('Advanced Web Form',t.indexOf('Feedback Widget')+20);R.page=t.slice(i,i+1500);await page.screenshot({path:RAW+'z2751-4.png'});
// feedback widget page too
await page.getByText(/^Feedback Widget$/).first().click();await page.waitForTimeout(8000);t=await bt();const j=t.indexOf('Feedback Widget',t.indexOf('Web Forms')+10);R.fw=t.slice(j,j+1200);await page.screenshot({path:RAW+'z2751-5.png'});
return R;};
