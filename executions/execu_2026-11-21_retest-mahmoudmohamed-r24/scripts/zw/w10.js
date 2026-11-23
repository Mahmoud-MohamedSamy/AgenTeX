module.exports=async(page)=>{const R={muts:[]};const RAW='../screenshots/raw/';
page.on('request',q=>{if(!['GET','OPTIONS'].includes(q.method())&&/desk\.zoho\.com/.test(q.url())&&!/_wms|pubsub|tipengine/.test(q.url()))R.muts.push(q.method()+' '+q.url().replace(/^https:\/\/[^/]+/,'').replace(/\?.*/,'').slice(0,90));});
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Web Forms?$/).first().click({timeout:20000}).catch(()=>{});await page.waitForTimeout(4000);await page.mouse.click(95,568);await page.waitForTimeout(25000);
await page.mouse.click(928,419);await page.waitForTimeout(15000);
const fl=page.frameLocator('iframe.zd_v2-olddeskiframe-deskIframe');R.frameUrl=await page.locator('iframe.zd_v2-olddeskiframe-deskIframe').getAttribute('src').then(s=>String(s).replace(/[?#].*/,'').slice(0,90)).catch(()=>'?');
R.gs=await fl.getByText('Get Started').count();await fl.getByText('Get Started').first().click({timeout:10000}).catch(e=>R.gsErr=e.message.slice(0,80));await page.waitForTimeout(2000);
for(const f of ['Last Name','Email','Subject']){const src=fl.getByText(f,{exact:true}).first();const dst=fl.locator('body');try{const bb=await src.boundingBox();await page.mouse.move(bb.x+20,bb.y+8);await page.mouse.down();await page.mouse.move(800,400,{steps:15});await page.mouse.move(900,450,{steps:15});await page.mouse.up();await page.waitForTimeout(2000);}catch(e){R['drag '+f]=e.message.slice(0,60);}}
await page.screenshot({path:RAW+'z2751-12.png'});
await fl.getByText('Next',{exact:true}).last().click({timeout:10000}).catch(e=>R.nextErr=e.message.slice(0,80));await page.waitForTimeout(10000);await page.screenshot({path:RAW+'z2751-13.png'});
const T=(await fl.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');R.text=T.slice(Math.max(0,T.indexOf('Web Form Department'))).slice(0,2000);return R;};
