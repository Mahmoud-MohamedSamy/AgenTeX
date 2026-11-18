const cfg=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8'));const ID=cfg.f08;const T=()=>new Date().toISOString().slice(11,19);
const safe=s=>String(s).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,'<addr>');
const openMore=async()=>{await page.keyboard.press('Escape').catch(()=>{});await sleep(400);const bs=page.getByRole('button',{name:'More ticket actions'});const n=await bs.count();let bi=0,by=1e9;for(let i=0;i<n;i++){const b=await bs.nth(i).boundingBox().catch(()=>null);if(b&&b.y<by){by=b.y;bi=i;}}await bs.nth(bi).click();await sleep(1200);return page.locator('[role=menu]').last();};
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
let m=await openMore();log(T(),'menu before',(await m.innerText()).replace(/\s+/g,' '));
await m.getByRole('menuitem',{name:'Mark as Spam',exact:true}).first().click();await sleep(2500);
const dl=page.locator('[role=dialog],[role=alertdialog]').last();log(T(),'spam dlg',safe(await dlg()));log('dlg box',JSON.stringify(await dl.boundingBox().catch(()=>null)));await shot('F08-1-spam-dialog.png');
await dl.getByRole('button',{name:/Mark as Spam/}).last().click();await sleep(6000);log(T(),'toast',safe(await toasts()));
await page.reload({waitUntil:'domcontentloaded'});await sleep(14000);
const sh=await api('GET','/desk/tickets/'+ID+'/shares');log(T(),'shares after spam',sh.s,JSON.stringify(sh.j?.data).slice(0,200));
const rs=await api('PUT','/desk/tickets/'+ID+'/shares',{shares:[{department_id:'194c0397-8060-48b2-9278-dae6d04b2bd3',access:'full'}]});log(T(),'re-share while spam',rs.s,safe(rs.t.slice(0,400)));
m=await openMore();log(T(),'menu after',(await m.innerText()).replace(/\s+/g,' '));await shot('F08-2-menu-after.png');await page.keyboard.press('Escape');await sleep(800);
const ab=page.getByRole('button',{name:/^Actions/});log('actions btn count',await ab.count());
if(await ab.count()){const bb=await ab.first().boundingBox();log('actions btn box',JSON.stringify(bb));await ab.first().click();await sleep(1500);
const pop=page.locator('[role=menu],[data-radix-popper-content-wrapper]').last();log(T(),'actions list',safe((await pop.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500)));log('pop box',JSON.stringify(await pop.boundingBox().catch(()=>null)));
await shot('F08-3-actions-on-spam.png');await page.keyboard.press('Escape');await sleep(600);}
log('head',safe((await mtxt()).slice(0,300)));
