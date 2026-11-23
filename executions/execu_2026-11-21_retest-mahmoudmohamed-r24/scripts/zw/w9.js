module.exports=async(page)=>{const R={};const RAW='../screenshots/raw/';
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit'});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Web Forms?$/).first().click({timeout:20000}).catch(()=>{});await page.waitForTimeout(4000);await page.mouse.click(95,568);await page.waitForTimeout(25000);
await page.mouse.click(928,419);await page.waitForTimeout(15000);
R.frames=[];for(const f of page.frames()){const n=await f.getByText('Get Started').count().catch(()=>-1);const m=await f.getByText('Webform Overhauled').count().catch(()=>-1);R.frames.push(f.url().replace(/[?#].*/,'').slice(0,90)+' gs='+n+' wo='+m);}
R.el=await page.evaluate(()=>{const e=document.elementFromPoint(734,411);return e?(e.tagName+' '+e.className+' '+(e.innerText||'').slice(0,40)):'none';});
return R;};
