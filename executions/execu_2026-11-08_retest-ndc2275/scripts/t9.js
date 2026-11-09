// Import wizard, module flow: CSV input, step through with bounded waits; records each step's text.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={net:[],steps:[]};const save=()=>fs.writeFileSync(OUT+'/t9.json',JSON.stringify(R,null,1));const RAW=OUT+'/../screenshots/raw/';
const cut=t=>{const i=t.lastIndexOf('Email Providers');return (i>0?t.slice(i+15):t).replace(/\s+/g,' ');};
const txt=async()=>cut(await page.innerText('main').catch(()=>page.innerText('body').catch(()=>'')));
page.on('response',async r=>{if(/\/import/.test(r.url())&&/api\/v1/.test(r.url())){let b='';try{b=(await r.text()).slice(0,240)}catch(e){}R.net.push(r.request().method()+' '+r.url().split('/api/v1')[1].slice(0,80)+' '+r.status()+' '+b.replace(/\s+/g,' '));if(R.net.length>40)R.net.shift();save();}});
await page.setViewportSize({width:1600,height:1100});
await page.goto(H+'/settings/data/import?module='+T,{waitUntil:'commit',timeout:120000});
for(let i=0;i<30;i++){await page.waitForTimeout(3000);if(/Start import/i.test(await txt()))break;}
await page.locator('input[type=file]').nth(1).setInputFiles(OUT+'/../evidence/import.csv',{timeout:20000});await page.waitForTimeout(8000);
const T0=Date.now();
for(let s=0;s<8&&Date.now()-T0<170000;s++){const t=await txt();R.url=page.url();const btns=await page.$$eval('main button, [role=dialog] button',e=>e.filter(x=>x.offsetParent).map(x=>(x.innerText||x.getAttribute('aria-label')||'').trim()+(x.disabled?' (off)':'')).filter(Boolean));const own=btns.slice(btns.indexOf('Email Providers')+1);
 R.steps.push({s,text:t.slice(0,1400),btns:own.slice(0,18)});await page.screenshot({path:RAW+'imp-s'+s+'.png',fullPage:true});save();
 const done=/imported|completed|finished|Undo import|Import complete/i.test(t)&&!/can be undone for 30 days\. Import history Choose/.test(t);if(done&&s>0)break;
 const nx=page.getByRole('button',{name:/^(Next|Continue|Validate|Run import|Start import|Import|Import now|Confirm)\b/i}).last();if(!(await nx.count()))break;if(await nx.isDisabled().catch(()=>true)){R.steps[R.steps.length-1].disabledNext=true;break;}R.steps[R.steps.length-1].clicked=(await nx.innerText()).trim();await nx.click({timeout:10000}).catch(e=>R.clickErr=String(e.message).slice(0,160));await page.waitForTimeout(7000);}
return 'ok';
