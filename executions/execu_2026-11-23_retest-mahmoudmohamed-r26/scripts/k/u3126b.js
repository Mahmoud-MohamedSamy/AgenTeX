const R={reqs:[]};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
page.on('response',async r=>{const u=r.url();if(/validation/.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,200));});
await page.goto(H+'/settings/modules-and-fields/'+L,{waitUntil:'domcontentloaded'});
for(let i=0;i<80;i++){await sleep(3000);if(await page.getByText(/^Validation Rules$/i).count())break;}
await page.getByText(/^Validation Rules$/i).first().click();for(let i=0;i<30;i++){await sleep(2000);if(await page.getByText(/No validation rules yet/).count())break;}
await page.getByRole('button',{name:'New Rule'}).first().click();await sleep(4000);
const dlg=page.locator('[role=dialog]:visible').last();R.dlg=await dlg.count();await shot('3126-create.png');
R.text=(await dlg.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1500);
R.inputs=await dlg.locator('input:visible,textarea:visible,button[role=combobox]:visible,select:visible').evaluateAll(es=>es.map(e=>e.tagName+':'+(e.getAttribute('placeholder')||e.getAttribute('name')||e.innerText||'').slice(0,40)));
return R;
