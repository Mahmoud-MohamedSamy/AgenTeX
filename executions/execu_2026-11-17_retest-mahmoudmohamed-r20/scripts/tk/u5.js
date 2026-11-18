const ID='4922b0bd-168c-445d-bcd9-2a6bd59fa59f';
const openMore=async()=>{await page.keyboard.press('Escape').catch(()=>{});await sleep(400);const bs=page.getByRole('button',{name:'More ticket actions'});const n=await bs.count();let bi=0,by=1e9;for(let i=0;i<n;i++){const b=await bs.nth(i).boundingBox().catch(()=>null);if(b&&b.y<by){by=b.y;bi=i;}}await bs.nth(bi).click();await sleep(1200);return page.locator('[role=menu]').last();};
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
const m=await openMore();log('menu',(await m.innerText()).replace(/\s+/g,' '));
await m.getByRole('menuitem',{name:'Clone',exact:true}).first().click();await sleep(9000);
log('url',page.url().replace(H,''));
const body=(await text()).replace(/\s+/g,' ');const i=body.indexOf('Status');log('status ctx',body.slice(Math.max(0,i-200),i+300));
await shot('3072-4-cloneB-form.png',{fullPage:false});
// find Status field
const st=page.getByText(/^Status/).first();await st.scrollIntoViewIfNeeded().catch(()=>{});await sleep(800);await shot('3072-5-cloneB-status.png');
NET.length=0;
const save=page.getByRole('button',{name:/^(Save|Submit|Create)$/}).first();log('savebtn',await save.innerText().catch(()=>'?'));await save.click();await sleep(8000);
log('after url',page.url().replace(H,''));log('toast',await toasts());log('after text',(await mtxt()).slice(0,500));
await shot('3072-6-cloneB-after-save.png');
log('NET',NET.filter(n=>!/heartbeat|summar|realtime|\/read$/.test(n.u)).map(n=>n.m+' '+(n.s||n.FAILED)+' '+n.u.slice(0,120)+' b='+n.b.slice(0,250)+' => '+(n.t||'').slice(0,250)));
