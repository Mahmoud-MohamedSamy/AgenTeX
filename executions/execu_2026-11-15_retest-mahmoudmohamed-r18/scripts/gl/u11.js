const net=[]; page.on('response',async r=>{ if(r.url().includes('mass-update') ){ net.push(r.request().method()+' '+r.url().split('/api/v1')[1].split('?')[0]+' '+r.status()+' '+(r.request().postData()||'').slice(0,300)+' → '+(await r.text().catch(()=>'')).slice(0,200)); }});
await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d',{waitUntil:'domcontentloaded'}); await sleep(14000);
await page.getByLabel('Select QA RT18 3025 T2').check(); await page.getByLabel('Select QA RT18 3025 T1').check(); await sleep(1500);
const bar=await page.locator('main button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim().slice(0,30)).filter(Boolean).slice(0,20));
const ub=page.locator('main button').filter({hasText:/^Update$/}).first(); await ub.click(); await sleep(2500);
const d=page.locator('[role=dialog]').last();
await d.getByRole('button',{name:'Choose a field'}).click(); await sleep(1500);
await page.getByRole('option',{name:/^Priority$/}).first().click(); await sleep(1500);
const dlg1=(await d.innerText()).replace(/\s+/g,' ');
await shot('3025-1-field-no-value.png');
const upd=d.getByRole('button',{name:'Update records'}); const dis=await upd.isDisabled().catch(()=>null);
if(!dis){ await upd.click(); await sleep(5000); }
const dlg2=(await page.locator('[role=dialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');
await shot('3025-2-after-update-click.png');
return {bar,dlg1,dis,dlg2,net};
