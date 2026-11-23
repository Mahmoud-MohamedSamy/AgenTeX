const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit'});await sleep(10000);
const s=page.getByPlaceholder(/search/i).last();if(await s.count()){await s.fill('3105 part').catch(()=>{});await sleep(4000);}
const row=page.locator('tr, [role=row], li, div[class*=row]',{hasText:'QA RT21 W2 3105 part'}).last();
await row.locator('button').last().click({timeout:15000});await sleep(1500);await page.getByRole('menuitem',{name:/^Edit/}).first().click({timeout:15000});await sleep(8000);R.url=page.url().replace(H,'');
const names=await page.locator('button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText||'').trim()).filter(Boolean).slice(-25));R.buttons=names;await shot('3119-r1-f-open-rule.png',{timeout:90000});
return R;
