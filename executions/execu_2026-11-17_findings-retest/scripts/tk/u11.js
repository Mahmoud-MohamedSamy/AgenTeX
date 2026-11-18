const cfg=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8'));const ID=cfg.t3073A;
const safe=s=>String(s).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,m=>/example\.com$/.test(m)?m:'<addr>');
const openMore=async()=>{await page.keyboard.press('Escape').catch(()=>{});await sleep(400);const bs=page.getByRole('button',{name:'More ticket actions'});const n=await bs.count();let bi=0,by=1e9;for(let i=0;i<n;i++){const b=await bs.nth(i).boundingBox().catch(()=>null);if(b&&b.y<by){by=b.y;bi=i;}}await bs.nth(bi).click();await sleep(1200);return page.locator('[role=menu]').last();};
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
await page.getByRole('button',{name:/^Actions/}).first().click();await sleep(1500);
log('actions menu',safe((await page.locator('[role=menu],[role=dialog],[data-radix-popper-content-wrapper]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,400)));
await shot('3073-4-actions-menu.png');await page.keyboard.press('Escape');await sleep(800);
// Not Spam
const m=await openMore();NET.length=0;await m.getByRole('menuitem',{name:'Not Spam'}).first().click();await sleep(3000);
const d=await dlg();log('notspam dlg',safe(d));if(d){const b=page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button',{name:/Not Spam/});if(await b.count()){await b.last().click();await sleep(4000);}}
log('toast',safe(await toasts()));
await page.reload({waitUntil:'domcontentloaded'});await sleep(14000);
log('replyAll after not spam',await page.getByRole('button',{name:/Reply All/}).count());
const sh=await api('GET','/desk/tickets/'+ID+'/shares');log('shares after not spam',sh.s,JSON.stringify(sh.j?.data).slice(0,200));
const g=await api('GET','/modules/'+TK+'/records/'+ID);log('is_spam',JSON.stringify((g.j.data.data.find(x=>x.field==='is_spam')||{}).value));
await shot('3073-5-not-spam.png');
