const VN='QA RT21 TK F12 view';
const side=async()=>{const lk=page.getByText(VN,{exact:true}).first();return (await lk.locator('xpath=..').innerText().catch(()=>'')).replace(/\s+/g,' ');};
const hdr=async()=>(await mtxt()).slice(0,160);
const T=()=>new Date().toISOString().slice(11,19);
await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Classic View'}).waitFor({timeout:200000});await sleep(2000);
const lk=page.getByText(VN,{exact:true}).first();await lk.scrollIntoViewIfNeeded();await lk.click();await sleep(10000);
log(T(),'before sidebar',await side(),'| header',await hdr());await shot('F12-1-before.png');
await page.getByRole('checkbox').first().click();await sleep(2000);
const sa=page.getByText(/Select all \d+ in this view/).first();if(await sa.count()){await sa.click();await sleep(1500);}
log('sel',(await mtxt()).slice(0,200));
const mb=main().getByRole('button',{name:/^More/});await mb.first().click();await sleep(1500);
await page.getByRole('menuitem',{name:/Delete/}).first().click();await sleep(2000);
log('dlg',await dlg());
const t0=Date.now();log(T(),'confirm delete');
await page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button',{name:/^Delete/}).last().click();
const seen=[];for(let i=0;i<20;i++){await sleep(1500);const ts=await toasts();if(ts&&!seen.includes(ts)){seen.push(ts);log('t+'+((Date.now()-t0)/1000).toFixed(1)+' toast: '+ts);}if(/moved to the recycle bin/i.test(ts))break;}
await sleep(4000);
log(T(),'after sidebar',await side(),'| header',await hdr());await shot('F12-2-after-delete.png');
await sleep(30000);
log(T(),'after +30s sidebar',await side(),'| header',await hdr());await shot('F12-3-after-30s.png');
// navigate to another view and back without reload
await page.getByText('All records',{exact:true}).first().click().catch(()=>{});await sleep(6000);
await page.getByText(VN,{exact:true}).first().click();await sleep(6000);
log(T(),'after view switch sidebar',await side(),'| header',await hdr());await shot('F12-4-after-switch.png');
await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Classic View'}).waitFor({timeout:200000});await sleep(8000);
log(T(),'after reload sidebar',await side(),'| header',await hdr());await shot('F12-5-after-reload.png');
