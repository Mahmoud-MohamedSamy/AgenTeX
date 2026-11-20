const R={muts:[]};page.on('request',q=>{const u=q.url();if(/web-forms/.test(u)&&!/preview/.test(u)&&q.method()!=='GET')R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' '+(q.postData()||'').replace(/fw1\.[\w.-]+/g,'<key>').slice(0,80));});
page.on('response',r=>{if(/web-forms\/[0-9a-f-]{36}$/.test(r.url())&&r.request().method()!=='GET')R.saveStatus=r.status();});
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/web-forms/8a2c94b7-324d-4eac-8ea9-7ea8ed73ccb4',{waitUntil:'commit'});await page.getByRole('tab',{name:'Settings'}).waitFor({timeout:90000});await sleep(2000);
await page.getByRole('tab',{name:'Settings'}).click();await sleep(3000);let t=await bt();R.site=(t.match(/.{0,60}(Website|website|domain|origin).{0,140}/g)||[]).slice(0,4);
const inp=page.locator('textarea').filter({hasNot:page.locator('xx')}).nth(0);const tas=page.locator('textarea');R.tas=[];for(let i=0;i<await tas.count();i++)R.tas.push((await tas.nth(i).getAttribute('placeholder'))||'');const ix=R.tas.findIndex(p=>/example.com|https?:/i.test(p));const inp2=ix>=0?tas.nth(ix):null;R.inp=ix;
if(inp2){const inp=inp2;await inp.scrollIntoViewIfNeeded();await shot('crm-2751-z5.png',{timeout:60000});await inp.fill('http://127.0.0.1:5500');await sleep(1200);
 const add=page.getByRole('button',{name:/^Add( website)?$/}).first();if(await add.count())await add.click().catch(()=>{});await sleep(1000);
 const sv=page.getByRole('button',{name:/^(Save|Save changes|Save settings)$/}).first();R.save=await sv.count();if(R.save){await sv.click();await sleep(5000);}
 t=await bt();R.after=(t.match(/.{0,60}127\.0\.0\.1.{0,60}/g)||[]).slice(0,3);R.toast=(t.match(/.{0,30}(saved|Saved|error|Error).{0,60}/g)||[]).slice(0,3);await shot('crm-2751-z6.png',{timeout:60000});}
return R;
