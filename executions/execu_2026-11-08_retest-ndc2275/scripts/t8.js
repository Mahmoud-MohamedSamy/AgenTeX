// Web form results + import wizard (module flow), bounded waits.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={net:[]};const save=()=>fs.writeFileSync(OUT+'/t8.json',JSON.stringify(R,null,1));const RAW=OUT+'/../screenshots/raw/';
// web form tickets: newest records, by subject
const find=async sub=>{for(let pg=1;pg<=3;pg++){const r=await api('GET','/modules/'+T+'/records?page='+pg+'&page_size=100&sort=-created_at');for(const x of arr(r.j&&r.j.data)){const o=fl(x);if(String(o.subject).includes(sub))return o;}}return null;};
for(const s of ['RT15SEQ webform 1','RT15NOMATCH webform 2']){const o=await find(s);if(o){LED('ticket "'+o.subject+'" '+o.id+' web form');R[s]={no:o.ticket_number,owner:nm(o.owner),auto:(await act(o.id)).filter(a=>a.action==='ticket.auto_assigned').map(a=>a.summary.rule_name+' / '+a.summary.trigger)};}else R[s]='not found on first pages';}save();
const txt=async()=>(await page.innerText('main').catch(()=>page.innerText('body').catch(()=>''))).replace(/\s+/g,' ');
page.on('response',async r=>{if(/\/import/.test(r.url())&&/api\/v1/.test(r.url())){let b='';try{b=(await r.text()).slice(0,260)}catch(e){}R.net.push(r.request().method()+' '+r.url().split('/api/v1')[1].slice(0,80)+' '+r.status()+' '+b.replace(/\s+/g,' '));save();}});
await page.setViewportSize({width:1600,height:1100});
await page.goto(H+'/settings/data/import?module='+T,{waitUntil:'commit',timeout:120000});
for(let i=0;i<30;i++){await page.waitForTimeout(3000);if(/Start import/i.test(await txt()))break;}
await page.getByRole('button',{name:/^Start import/i}).first().click({timeout:15000}).catch(e=>R.startErr=String(e.message).slice(0,200));
await page.waitForTimeout(6000);R.url1=page.url();const main=(await txt());R.s1=main.slice(main.indexOf('Import')).slice(0,900);R.inputs=await page.locator('input[type=file]').evaluateAll(e=>e.map(x=>x.accept+'|'+(x.getAttribute('aria-label')||'')));await page.screenshot({path:RAW+'imp-a.png'});save();
return 'ok';
