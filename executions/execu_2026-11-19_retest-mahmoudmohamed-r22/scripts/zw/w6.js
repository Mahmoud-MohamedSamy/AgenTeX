module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';const bt=async()=>(await page.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Web Forms?$/).first().click();await page.waitForTimeout(4000);
await page.mouse.click(95,568);await page.waitForTimeout(30000);
const t=await bt();R.content=t.split('Live Chat Need Help')[0].split('My Information Preferences Workstation')[1]||t.slice(-800);await page.screenshot({path:RAW+'z2751-8.png'});return R;};
