module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Feedback Widget$/).first().click({timeout:20000}).catch(async()=>{await page.getByText(/^Web Forms?$/).first().click();await page.waitForTimeout(3000);await page.getByText(/^Feedback Widget$/).first().click();});
await page.waitForTimeout(20000);const fl=page.frameLocator('iframe.zd_v2-olddeskiframe-deskIframe');
const c=fl.getByText(/Create Feedback Widget/).first();R.create=await c.count();if(R.create){await c.click();await page.waitForTimeout(12000);}
const T=(await fl.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');const i=T.indexOf('Sign Out');R.text=T.slice(i+8,i+3500);
R.domainHits=(T.match(/.{0,80}(domain|Domain|website|Website|URL|origin).{0,100}/g)||[]).slice(0,8);
await page.screenshot({path:RAW+'z2751-14.png'});await fl.locator('body').evaluate(b=>window.scrollTo(0,99999)).catch(()=>{});await page.mouse.wheel(0,2000);await page.waitForTimeout(1500);await page.screenshot({path:RAW+'z2751-15.png'});return R;};
