const R={muts:[]};page.on('request',q=>{const u=q.url();if(/web-forms/.test(u)&&q.method()!=='GET')R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' '+(q.postData()||'').slice(0,200));});
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/web-forms',{waitUntil:'commit'});await page.getByText('QA RT18 2959 form').first().waitFor({timeout:90000});await sleep(2000);
await page.getByRole('button',{name:/Embed code/}).first().click();await sleep(3000);let t=await bt();R.dlg=(t.match(/.{0,40}(website|Website|domain|origin).{0,200}/g)||[]).slice(0,5);await shot('crm-2751-z2.png',{timeout:60000});
const inp=page.getByPlaceholder(/https?:|website|domain|example/i).first();R.inp=await inp.count();
if(R.inp){await inp.fill('http://127.0.0.1:5500');await page.keyboard.press('Enter');await sleep(1000);const b=page.getByRole('button',{name:/^(Add|Save)/}).first();if(await b.count())await b.click().catch(()=>{});await sleep(3000);t=await bt();R.after=(t.match(/.{0,80}127\.0\.0\.1.{0,80}/g)||[]).slice(0,3);await shot('crm-2751-z3.png',{timeout:60000});}
return R;
