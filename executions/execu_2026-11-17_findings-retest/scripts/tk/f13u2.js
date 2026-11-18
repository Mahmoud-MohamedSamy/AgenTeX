const cfg=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8'));
const T=()=>new Date().toISOString().slice(11,19);
const openMore=async()=>{await page.keyboard.press('Escape').catch(()=>{});await sleep(400);const bs=page.getByRole('button',{name:'More ticket actions'});const n=await bs.count();let bi=0,by=1e9;for(let i=0;i<n;i++){const b=await bs.nth(i).boundingBox().catch(()=>null);if(b&&b.y<by){by=b.y;bi=i;}}await bs.nth(bi).click();await sleep(1200);return page.locator('[role=menu]').last();};
const ctxOf=(body,k,n=160)=>{const i=body.indexOf(k);return i<0?'(no '+k+')':body.slice(i,i+n);};
const ID=cfg.f13c;
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
log(T(),'C source',ctxOf((await text()).replace(/\s+/g,' '),'Ticket Owner',80));await shot('F13-C-1-source.png');
const m=await openMore();await m.getByRole('menuitem',{name:'Clone',exact:true}).first().click();await sleep(9000);
log(T(),'C clone form',ctxOf((await text()).replace(/\s+/g,' '),'Ticket Owner'));
const own=page.getByText(/^Ticket Owner/).first();await own.scrollIntoViewIfNeeded().catch(()=>{});await sleep(800);log('box',JSON.stringify(await own.boundingBox().catch(()=>null)));
await shot('F13-C-2-clone-form.png');
NET.length=0;await page.getByRole('button',{name:/^(Save|Submit|Create)$/}).first().click();await sleep(8000);
log(T(),'after url',page.url().replace(H,''));
const p=NET.find(n=>n.m==='POST'&&/\/records$/.test(n.u.split('?')[0]));if(p){const b=JSON.parse(p.b.length<300?p.b:'{}');log('POST',p.s,'body has owner?',/"owner"/.test(p.b),p.b.match(/"field":"owner","value":\{[^}]*\}/)?.[0]||'(not in first 300 chars)');}
await shot('F13-C-3-after-save.png');
log('C clone page',ctxOf((await text()).replace(/\s+/g,' '),'Ticket Owner',80));
