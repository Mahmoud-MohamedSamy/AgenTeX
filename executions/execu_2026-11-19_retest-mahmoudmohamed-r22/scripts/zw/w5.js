module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';const bt=async()=>(await page.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Web Forms?$/).first().click();await page.waitForTimeout(3000);
await page.getByText(/^Advanced Web Form$/).first().click();await page.waitForTimeout(6000);
for(let w=0;w<10;w++){const t=await bt();if(!/You haven't configured any Feedback Widget/.test(t))break;await page.waitForTimeout(2000);}
let t=await bt();const i=t.indexOf('Desktop Notification');R.main=t.replace(/.*Allowlist and Blocklist PERSONALIZATION.*?Live Chat Need Help/,'').slice(0,100);
const k=t.search(/Advanced Web Form(?! Community)/);R.awf=t.slice(Math.max(0,t.indexOf('Teams Roles')-0),t.indexOf('Teams Roles')).slice(0,10);
R.content=t.split('Live Chat Need Help').pop().slice(0,50);R.full=t.slice(0,1400);await page.screenshot({path:RAW+'z2751-7.png'});return R;};
