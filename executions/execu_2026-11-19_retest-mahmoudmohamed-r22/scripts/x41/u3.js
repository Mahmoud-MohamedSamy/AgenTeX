const R={net:[]};const id='b5e0b71b-8f6e-462d-8491-a804ccc483cb';
page.on('response',async r=>{if(/\/records\//.test(r.url())&&['PATCH','PUT'].includes(r.request().method())){let b='';try{b=(await r.text()).slice(0,300)}catch(e){}R.net.push(r.status()+' '+b);}});
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+id,{waitUntil:'commit'});
for(let i=0;i<30;i++){await sleep(2000);if(/dept only renamed/.test(await text()))break;}await sleep(3000);
const d=page.getByText('QA RT19 SLA Dept',{exact:true}).first();await d.hover();await sleep(800);await d.click({timeout:8000}).catch(e=>R.click='ERR');await sleep(2500);
await shot('2841-r3-2-dept-click.png');
R.inputs=await page.locator('input:visible, [role=combobox]:visible, select:visible, [role=dialog]:visible').count();
R.opts=(await page.locator('[role=option]:visible, [cmdk-item]:visible').allInnerTexts()).map(x=>x.trim()).slice(0,20);
// edit form via More menu
await page.keyboard.press('Escape');await sleep(500);
await page.locator('button:has(svg)').filter({hasNotText:/./}).last().click().catch(()=>{});await sleep(1500);
R.menu=(await page.locator('[role=menuitem]:visible').allInnerTexts()).map(x=>x.trim());await shot('2841-r3-2b-menu.png');
return R;
