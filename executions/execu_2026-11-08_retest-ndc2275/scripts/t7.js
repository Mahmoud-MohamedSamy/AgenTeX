// Import wizard, bounded: every wait has a limit; records /import API calls (no bodies with tokens).
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={net:[]};const save=()=>fs.writeFileSync(OUT+'/t7.json',JSON.stringify(R,null,1));const RAW=OUT+'/../screenshots/raw/';
const txt=async()=>(await page.innerText('main').catch(()=>page.innerText('body').catch(()=>''))).replace(/\s+/g,' ');
page.on('response',async r=>{if(/\/import/.test(r.url())&&/api\/v1/.test(r.url())){let b='';try{b=(await r.text()).slice(0,300)}catch(e){}R.net.push(r.request().method()+' '+r.url().split('/api/v1')[1].slice(0,90)+' '+r.status()+' '+b.replace(/\s+/g,' ').slice(0,180));save();}});
await page.setViewportSize({width:1600,height:1100});
await page.goto(H+'/settings/data/import?module='+T,{waitUntil:'commit',timeout:120000});
for(let i=0;i<30;i++){await page.waitForTimeout(3000);if(/Start import/i.test(await txt()))break;}
await page.locator('input[type=file]').first().setInputFiles(OUT+'/../evidence/import.csv',{timeout:20000});await page.waitForTimeout(4000);
R.step1=(await txt()).slice(-700);await page.screenshot({path:RAW+'imp-1.png',fullPage:true});save();
await page.getByRole('button',{name:/Start import/i}).first().click({timeout:10000}).catch(e=>R.startErr=String(e.message).slice(0,160));
for(let i=0;i<15;i++){await page.waitForTimeout(2000);const t=await txt();if(/map|Map/.test(t)&&!/Start import/.test(t))break;}
await page.waitForTimeout(3000);R.step2=(await txt()).slice(0,2200);R.url=page.url();await page.screenshot({path:RAW+'imp-2.png',fullPage:true});
R.btns=await page.$$eval('main button',e=>e.map(x=>(x.innerText||'').trim()+(x.disabled?'(off)':'')).filter(Boolean).slice(-14));save();
return 'ok';
