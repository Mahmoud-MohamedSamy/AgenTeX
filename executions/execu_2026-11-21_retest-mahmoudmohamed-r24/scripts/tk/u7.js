const ID=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8')).t3064;
const safe=s=>s.replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,m=>/example\.com$/.test(m)?m:'<addr>');
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
await page.getByRole('button',{name:/^Edit$/}).first().click();await sleep(5000);
const d=page.getByRole('dialog',{name:'Edit ticket'});
await d.getByText('Choose a record…').first().click();await sleep(1500);
await page.keyboard.type('QA RT20 TK');await sleep(3000);
await page.getByRole('row',{name:/Contact C1/}).getByRole('checkbox').click().catch(()=>{});await sleep(500);await page.getByRole('dialog',{name:'Choose a record'}).getByRole('button',{name:/^Select$/}).click();await sleep(1500);
const subj=d.locator('input').filter({hasNotText:'x'});
// subject is a combobox-ish input; fill by label
const idx=await d.locator('input').evaluateAll(els=>els.findIndex(e=>e.value==='QA RT20 TK 3064 edit contact'));log('subj idx',idx);const si=d.locator('input').nth(Math.max(idx,0));
if(idx>=0){await si.fill('QA RT20 TK 3064 edit contact EDITED');}
await d.locator('textarea').first().fill('QA RT20 TK retest edited in Edit form');
// priority
await d.getByText('Priority',{exact:true}).scrollIntoViewIfNeeded();await sleep(500);
const pb=d.locator('button').filter({hasText:/^Low$/});log('prio btn',await pb.count());
if(await pb.count()){await pb.first().click();await sleep(1200);await page.getByRole('option',{name:'High'}).first().click().catch(async()=>{await page.getByText('High',{exact:true}).last().click();});await sleep(800);}
await d.getByText('Ticket Information').first().scrollIntoViewIfNeeded();await sleep(500);
await shot('3064-4-edit-filled.png');
NET.length=0;await d.getByRole('button',{name:/^Save$/}).click();await sleep(6000);
log('toast',safe(await toasts()));
log('NET',NET.filter(n=>!/heartbeat|summar|realtime|\/read$|lookups/.test(n.u)).map(n=>n.m+' '+(n.s||n.FAILED)+' '+n.u.slice(0,110)+' b='+safe(n.b.slice(0,300))+' => '+safe((n.t||'').slice(0,160))));
await shot('3064-5-after-edit-save.png');
const g=await api('GET','/modules/'+TK+'/records/'+ID);const o={};for(const x of g.j.data.data)o[x.field]=x.value?.value;delete o.email;log('rec',JSON.stringify(o));
