const fs=require('fs');
module.exports=async(page)=>{const R={muts:[]};const RAW='../screenshots/raw/';
page.on('request',q=>{if(!['GET','OPTIONS'].includes(q.method())&&/desk\.zoho\.com\/support/.test(q.url())&&!/getbadge|getresource/.test(q.url()))R.muts.push(q.method()+' '+q.url().replace(/^https:\/\/[^/]+/,'').replace(/\?.*/,'').slice(0,90));});
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit',timeout:90000});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Feedback Widget$/).first().click({timeout:20000}).catch(async()=>{await page.getByText(/^Web Forms?$/).first().click();await page.waitForTimeout(3000);await page.getByText(/^Feedback Widget$/).first().click();});
await page.waitForTimeout(20000);const fl=page.frameLocator('iframe.zd_v2-olddeskiframe-deskIframe');
await page.screenshot({path:RAW+'z2751-15b.png'});R.pre=(await fl.locator('body').innerText().catch(()=>'')).replace(/s+/g,' ').split('Sign Out').pop().slice(0,400);await fl.getByText(/Create Feedback Widget/).first().click({timeout:15000}).catch(e=>R.createErr=1);await page.waitForTimeout(12000);
const sel=fl.locator('select').first();R.selCount=await fl.locator('select').count();
if(R.selCount){const opts=await sel.locator('option').allInnerTexts();R.opts=opts.slice(0,6);await sel.selectOption({label:'Tech'}).catch(e=>R.selErr=e.message.slice(0,60));}
else{await fl.getByText('Select Department---').first().click().catch(()=>{});await page.waitForTimeout(1500);await fl.getByText('Tech',{exact:true}).last().click().catch(e=>R.selErr=e.message.slice(0,60));}
await page.waitForTimeout(1500);await page.screenshot({path:RAW+'z2751-16.png'});
await fl.getByText('Save',{exact:true}).last().click().catch(e=>R.saveErr=e.message.slice(0,60));await page.waitForTimeout(12000);
const T=(await fl.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');const i=T.indexOf('Sign Out');R.after=T.slice(i+8,i+2500);
await page.screenshot({path:RAW+'z2751-17.png'});
const ta=fl.locator('textarea');R.ta=await ta.count();if(R.ta){const code=await ta.first().inputValue();fs.writeFileSync('../out/zoho-fw-code.txt',code);R.codeLen=code.length;}
return R;};
