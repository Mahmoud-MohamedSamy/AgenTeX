const R={reqs:[]};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
page.on('response',async r=>{const u=r.url();if(/validation/.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300));});
await page.goto(H+'/settings/modules-and-fields/'+L,{waitUntil:'domcontentloaded'});
for(let i=0;i<80;i++){await sleep(3000);if(await page.getByText(/^Validation Rules$/i).count())break;}
await page.getByText(/^Validation Rules$/i).first().click();for(let i=0;i<30;i++){await sleep(2000);if(await page.getByRole('button',{name:'New Rule'}).count())break;}
await page.getByRole('button',{name:'New Rule'}).first().click();await sleep(3000);
const dlg=page.locator('[role=dialog]:visible').last();
await dlg.getByPlaceholder('e.g. Serial number format').fill('QA RT26 VR');
await dlg.getByText('Choose a field…').click();await sleep(1500);
const opts=page.locator('[role=option]:visible');R.opts=(await opts.allInnerTexts()).slice(0,12);
const want=R.opts.findIndex(o=>/^(Last Name|First Name|Company|Description)$/i.test(o.trim()));await opts.nth(want>=0?want:0).click();await sleep(2000);
await dlg.evaluate(d=>{const sc=[...d.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+20&&/auto|scroll/.test(getComputedStyle(e).overflowY));if(sc)sc.scrollTop=sc.scrollHeight;});await sleep(1000);
await shot('3126-c-cond.png');R.text=(await dlg.innerText()).replace(/\s+/g,' ').slice(0,1500);
return R;
