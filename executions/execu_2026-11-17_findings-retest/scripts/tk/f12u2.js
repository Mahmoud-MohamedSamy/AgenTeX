const VN='QA RT21 TK F12 view';
const side=async()=>{const lk=page.getByText(VN,{exact:true}).first();return (await lk.locator('xpath=..').innerText().catch(()=>'')).replace(/\s+/g,' ').replace(VN,'').trim();};
const hdr=async()=>((await mtxt()).match(/\((\d+)\)/)||[])[1];
const T=()=>new Date().toISOString().slice(11,19);
await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Classic View'}).waitFor({timeout:200000});await sleep(2000);
const lk=page.getByText(VN,{exact:true}).first();await lk.scrollIntoViewIfNeeded();await lk.click();await sleep(10000);
log(T(),'before sidebar',await side(),'header',await hdr());
await page.getByRole('checkbox').first().click();await sleep(2000);
const mb=main().getByRole('button',{name:/^More/});await mb.first().click();await sleep(1500);
await page.getByRole('menuitem',{name:/Delete/}).first().click();await sleep(2000);
const t0=Date.now();log(T(),'confirm delete',await dlg());
await page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button',{name:/^Delete/}).last().click();
let last='',shotTaken=false;for(let i=0;i<45;i++){await sleep(2000);const s=await side(),h=await hdr(),ts=(await toasts()).slice(0,60);const k=s+'/'+h;if(k!==last){last=k;log('t+'+((Date.now()-t0)/1000).toFixed(1),T(),'sidebar',s,'header',h,'toast',ts);}if(!shotTaken&&h==='0'&&s==='25'){await shot('F12-6-r2-stale.png');shotTaken=true;}if(s==='0'&&h==='0'&&i>3)break;}
await shot('F12-7-r2-settled.png');
