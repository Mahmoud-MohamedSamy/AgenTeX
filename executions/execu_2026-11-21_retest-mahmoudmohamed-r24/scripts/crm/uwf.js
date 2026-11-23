const R={muts:[]};page.on('request',q=>{const u=q.url();if(/web-forms/.test(u)&&q.method()!=='GET')R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' '+(q.postData()||'').slice(0,160));});
const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings',{waitUntil:'commit'});await sleep(6000);await page.getByText('Web Forms',{exact:true}).first().click({timeout:15000});await sleep(6000);R.url=page.url().replace(H,'');
await page.getByText('QA RT18 2959 form').first().click({timeout:15000});await sleep(6000);R.url2=page.url().replace(H,'');
const t=await bt();R.hits=[...new Set(t.match(/.{0,60}(website|Website|origin|domain|Add it to your).{0,80}/g)||[])].slice(0,8);await shot('crm-2751-z1.png',{timeout:60000});
R.btns=(await page.locator('main button:visible').allInnerTexts()).map(s=>s.trim()).filter(s=>s.length>0&&s.length<40).slice(0,30);return R;
