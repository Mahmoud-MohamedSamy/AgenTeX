await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Classic View'}).waitFor({timeout:200000});await sleep(2000);
const lk=page.getByText('QA RT21 TK 3055 view',{exact:true}).first();await lk.scrollIntoViewIfNeeded();await lk.click();await sleep(10000);
await page.getByRole('checkbox').first().click();await sleep(2000);
await page.getByText(/Select all 300 in this view/).first().click();await sleep(2000);
log('sel',(await mtxt()).slice(0,200));await shot('3055-1-select-all-300.png');
const mb=main().getByRole('button',{name:/^More/});log('morebtns',await mb.count());await mb.first().click();await sleep(1500);
const menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).replace(/\s+/g,' ');log('menu',menu);
await page.getByRole('menuitem',{name:/Delete/}).first().click();await sleep(2000);
log('dlg',await dlg());await shot('3055-2-confirm.png');
NET.length=0;const t0=Date.now();
await page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button',{name:/^Delete/}).last().click();
const seen=[];for(let i=0;i<45;i++){await sleep(2000);const ts=await toasts();if(ts&&!seen.includes(ts)){seen.push(ts);log('t+'+((Date.now()-t0)/1000).toFixed(1)+' toast: '+ts);}if(i===2)await shot('3055-3-after-3s.png');if(NET.some(n=>/delete|bulk/i.test(n.u)&&n.s)&&i>4)break;}
log('elapsed',(Date.now()-t0)/1000);
await shot('3055-4-result.png');log('after',(await mtxt()).slice(0,400));
log('NET',NET.filter(n=>!/heartbeat|summar|realtime|\/read$/.test(n.u)).map(n=>n.m+' '+(n.s||n.FAILED)+' len='+n.len+' '+n.u.slice(0,160)+' b='+n.b.slice(0,200)+' => '+(n.t||'').slice(0,250)));
await page.reload({waitUntil:'domcontentloaded'});await sleep(15000);
log('reload',(await mtxt()).slice(0,300));await shot('3055-5-reload.png');
