module.exports=async(page)=>{const R={muts:[]};const RAW='../screenshots/raw/';const bt=async()=>(await page.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
page.on('request',q=>{if(!['GET','OPTIONS'].includes(q.method())&&/desk\.zoho\.com\/(api|supportapi)/.test(q.url()))R.muts.push(q.method()+' '+q.url().replace(/^https:\/\/[^/]+/,'').slice(0,100));});
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.screenshot({path:RAW+'z2751-8a.png'});await page.getByText(/^Web Forms?$/).first().click({timeout:20000}).catch(e=>R.e1='webforms');await page.waitForTimeout(4000);await page.mouse.click(95,568);await page.waitForTimeout(25000);
await page.screenshot({path:RAW+'z2751-8b.png'});await page.mouse.click(928,419);await page.waitForTimeout(12000);
const t=await bt();R.step1=t.split('My Information Preferences Workstation').pop().split('My Pins Chats')[0].slice(0,100)||'';R.all=t.slice(t.indexOf('Workstation')+11,t.indexOf('Workstation')+11).slice(0,5);
const body=t.replace(/^.*?PERSONALIZATION My Profile My Information Preferences Workstation/,'');R.body=body.slice(0,1500);
await page.screenshot({path:RAW+'z2751-9.png'});return R;};
