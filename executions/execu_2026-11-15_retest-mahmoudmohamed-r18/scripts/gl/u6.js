const res=[]; page.on('response',async r=>{ if(r.url().includes('spam-contacts') && r.request().method()!=='GET'){ res.push(r.request().method()+' '+r.status()+' '+(r.request().postData()||'')+' → '+(await r.text().catch(()=>'')).slice(0,300)); }});
await page.goto(H+'/settings/channels/email',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByRole('tab',{name:/Blocked addresses/}).click(); await sleep(3000);
const m0=(await page.locator('main').last().innerText()).replace(/\s+/g,' ');
const inputs=await page.locator('main input').evaluateAll(es=>es.map(e=>[e.placeholder,e.type,e.name]));
await shot('3008-0-tab.png');
return {m0:m0.slice(m0.indexOf('Suppressions'),m0.indexOf('Suppressions')+1500),inputs};
