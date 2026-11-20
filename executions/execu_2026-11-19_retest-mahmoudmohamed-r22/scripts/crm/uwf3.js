const R={muts:[]};page.on('request',q=>{const u=q.url();if(/web-forms/.test(u)&&q.method()!=='GET')R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' '+(q.postData()||'').replace(/fw1\.[\w.-]+/g,'<key>').slice(0,120));});
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(let a=0;a<3;a++){await page.goto(H+'/settings/web-forms',{waitUntil:'commit'});if(await page.getByText('QA RT18 2959 form').first().waitFor({timeout:60000}).then(()=>1,()=>0))break;}await sleep(2000);
await page.mouse.click(1545,240);await sleep(1500);R.menu=(await page.locator('[role=menu],[role=menuitem]').allInnerTexts()).join('|').slice(0,200);
await page.getByRole('menuitem',{name:/Edit|Settings|Open/}).first().click({timeout:8000}).catch(async()=>{await page.keyboard.press('Escape');await page.getByText('QA RT18 2959 form').first().click();});
await sleep(7000);R.url=page.url().replace(H,'');let t=await bt();R.site=(t.match(/.{0,80}(Website|website|domain).{0,120}/g)||[]).slice(0,5);await shot('crm-2751-z4.png',{timeout:60000});
R.tabs=(await page.locator('[role=tab]:visible').allInnerTexts()).slice(0,12);return R;
