const cfg=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8'));
const T=()=>new Date().toISOString().slice(11,19);
const openMore=async()=>{await page.keyboard.press('Escape').catch(()=>{});await sleep(400);const bs=page.getByRole('button',{name:'More ticket actions'});const n=await bs.count();let bi=0,by=1e9;for(let i=0;i<n;i++){const b=await bs.nth(i).boundingBox().catch(()=>null);if(b&&b.y<by){by=b.y;bi=i;}}await bs.nth(bi).click();await sleep(1200);return page.locator('[role=menu]').last();};
const ctxOf=(body,k,n=260)=>{const i=body.indexOf(k);return i<0?'(no '+k+')':body.slice(i,i+n);};
for(const [tag,ID,save] of [['A',cfg.f13a,true],['B',cfg.f13b,false]]){
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
const b0=(await text()).replace(/\s+/g,' ');log(T(),tag,'source owner ctx',ctxOf(b0,'Ticket Owner',120));
await shot('F13-'+tag+'-1-source.png');
const m=await openMore();await m.getByRole('menuitem',{name:'Clone',exact:true}).first().click();await sleep(9000);
const body=(await text()).replace(/\s+/g,' ');log(T(),tag,'clone form owner ctx',ctxOf(body,'Ticket Owner'));
const own=page.getByText(/^Ticket Owner/).first();await own.scrollIntoViewIfNeeded().catch(()=>{});await sleep(800);
const bb=await own.boundingBox().catch(()=>null);log(tag,'owner label box',JSON.stringify(bb));
await shot('F13-'+tag+'-2-clone-form.png');
if(save){NET.length=0;const sv=page.getByRole('button',{name:/^(Save|Submit|Create)$/}).first();await sv.click();await sleep(8000);log(T(),tag,'after url',page.url().replace(H,''),'toast',await toasts());
const p=NET.find(n=>n.m==='POST'&&/\/records$/.test(n.u.split('?')[0]));log(tag,'POST',p?p.s+' '+p.b.slice(0,300)+' => '+p.t.slice(0,200):'none');await shot('F13-'+tag+'-3-after-save.png');}
else{await page.keyboard.press('Escape');await sleep(1000);const c=page.getByRole('button',{name:/^Cancel$/}).first();if(await c.count())await c.click().catch(()=>{});await sleep(1500);log(tag,'cancelled, url',page.url().replace(H,''));}
}
