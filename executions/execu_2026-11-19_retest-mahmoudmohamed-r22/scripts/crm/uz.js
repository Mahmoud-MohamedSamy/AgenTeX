const R={};await page.goto(H+'/settings',{waitUntil:'commit'});await sleep(6000);await page.getByText('Global Sets',{exact:true}).first().click({timeout:15000});await sleep(6000);R.url=page.url().replace(H,'');
const s=page.getByPlaceholder(/search/i).last();if(await s.count()){await s.fill('QA RT22 GS 3087');await sleep(3000);}
await shot('crm-3087-z.png',{timeout:90000});R.has=await page.getByText('QA RT22 GS 3087').count();R.btns=await page.locator('main button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText||'').trim()).filter(Boolean).slice(0,20));return R;
