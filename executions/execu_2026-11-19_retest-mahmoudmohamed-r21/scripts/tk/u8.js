const cfg=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8'));const ID=cfg.t3064, ID2=cfg.t3064b;
const safe=s=>s.replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,m=>/example\.com$/.test(m)?m:'<addr>');
const cid=async id=>{const g=await api('GET','/modules/'+TK+'/records/'+id);const f=(g.j.data.data||[]).find(x=>x.field==='contact_id');return f?f.value?.value??null:'(absent)';};
const nm=x=>x===cfg.conC1?'C1':x===cfg.conC2?'C2':x;
const pick=async name=>{await page.keyboard.type('QA RT20 TK');await sleep(3000);await page.getByRole('row',{name:new RegExp(name)}).getByRole('checkbox').click();await sleep(500);await page.locator('[role=dialog]').last().getByRole('button',{name:/^Select$/}).last().click();await sleep(4000);};
const net=()=>NET.filter(n=>!/heartbeat|summar|realtime|\/read$|lookups/.test(n.u)).map(n=>n.m+' '+(n.s||n.FAILED)+' '+n.u.slice(0,90)+' b='+safe(n.b.slice(0,200)));
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
// change
NET.length=0;await page.getByRole('button',{name:'Change contact'}).click();await sleep(2000);await pick('Contact C2');
log('change toast',safe(await toasts()),'net',net(),'contact now',nm(await cid(ID)));await shot('3064-6-changed-to-C2.png');
// remove
NET.length=0;await page.getByRole('button',{name:'Remove contact'}).click();await sleep(2000);
const dd=await dlg();log('remove dlg',safe(dd));await shot('3064-7-remove-confirm.png');
if(dd){const b=page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button',{name:/Remove/});if(await b.count())await b.last().click();await sleep(4000);}
log('remove toast',safe(await toasts()),'net',net(),'contact now',nm(await cid(ID)));await shot('3064-8-removed.png');
// add via card on ticket 2
await page.goto(H+'/views/all/tickets/'+ID2,{waitUntil:'domcontentloaded'});await sleep(14000);
NET.length=0;await page.getByRole('button',{name:/Add contact/}).first().click();await sleep(2000);await pick('Contact C1');
log('add toast',safe(await toasts()),'net',net(),'contact now',nm(await cid(ID2)));await shot('3064-9-added-C1.png');
// reload persistence
await page.reload({waitUntil:'domcontentloaded'});await sleep(12000);
const card=(await page.getByText('Contact Info').first().locator('xpath=../..').innerText().catch(()=>'')).replace(/\s+/g,' ');log('card after reload',safe(card.slice(0,200)));
