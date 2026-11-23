module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';
const all=async()=>{let s='';for(const f of page.frames()){s+=' ||'+f.url().slice(0,60)+'|| '+(await f.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1500);}return s;};
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Web Forms?$/).first().click();await page.waitForTimeout(3000);
await page.getByText(/^Advanced Web Form$/).first().click();await page.waitForTimeout(20000);R.u=page.url().replace(/^https:\/\/[^/]+/,'');
const t=await all();const i=t.lastIndexOf('Advanced Web Form');R.awf=t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g,'<email>').slice(-1800);await page.screenshot({path:RAW+'z2751-6.png'});
return R;};
