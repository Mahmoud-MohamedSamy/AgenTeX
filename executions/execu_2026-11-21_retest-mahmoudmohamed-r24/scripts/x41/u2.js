const R={net:[]};const id='b5e0b71b-8f6e-462d-8491-a804ccc483cb';
page.on('response',async r=>{if(/\/records\//.test(r.url())&&['PATCH','PUT'].includes(r.request().method())){let b='';try{b=(await r.text()).slice(0,300)}catch(e){}R.net.push(r.status()+' '+b);}});
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+id,{waitUntil:'commit'});
for(let i=0;i<30;i++){await sleep(2000);if(/dept only renamed/.test(await text()))break;}await sleep(3000);
await page.getByRole('button',{name:/^Department/}).first().click();await sleep(2500);
await shot('2841-r3-2-dept-open.png');
R.opts=(await page.locator('[role=option], [cmdk-item], [role=listbox] li').allInnerTexts()).map(x=>x.trim()).slice(0,20);
const o=page.getByRole('option',{name:'QA RT19 SLA Dept B',exact:true}).first();
if(await o.count())await o.click();else await page.getByText('QA RT19 SLA Dept B',{exact:true}).last().click();
await sleep(2000);await shot('2841-r3-3-dept-picked.png');
const sv=page.getByRole('button',{name:/^(Save|✓|Update)$/}).first();if(await sv.count()){await sv.click();}else{await page.keyboard.press('Enter');}
await sleep(4000);await shot('2841-r3-4-after-save.png');
const t=(await text()).replace(/\s+/g,' ');R.msg=t.match(/[^.]{0,80}(support plan belongs|another department|Choose a support plan)[^.]{0,160}\.?/gi);
await page.reload({waitUntil:'domcontentloaded'});for(let i=0;i<20;i++){await sleep(2000);if(/dept only renamed/.test(await text()))break;}await sleep(2500);
R.deptAfterReload=(await page.getByRole('button',{name:/^Department/}).first().innerText()).replace(/\s+/g,' ');
await shot('2841-r3-5-reload.png');return R;
