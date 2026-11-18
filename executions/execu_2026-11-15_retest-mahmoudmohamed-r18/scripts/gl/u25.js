const reqs=[]; page.on('request',r=>{ if(r.url().includes('/api/v1/desk/community')) reqs.push(r.method()+' '+r.url().split('/api/v1')[1].slice(0,100)); });
await page.goto(H+'/community',{waitUntil:'domcontentloaded'}); await sleep(12000);
const t0=(await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(0,500);
await page.getByText('test ticket from help center').first().click().catch(()=>{}); await sleep(9000);
const url=page.url();
const btns=await page.locator('main button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim()).filter(Boolean));
const tools=page.locator('main button').filter({hasText:/^Tools$/}).first(); let menu='';
if(await tools.count()){ await tools.click(); await sleep(1500); menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).replace(/\s+/g,' | '); }
else { const b=page.getByRole('button',{name:/Tools|More|Topic actions/i}).first(); if(await b.count()){ await b.click(); await sleep(1500); menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).replace(/\s+/g,' | ');} }
await shot('3007-1-topic-tools.png');
return {t0,url,btns:btns.slice(-25),menu,reqs:[...new Set(reqs)].slice(0,10)};
