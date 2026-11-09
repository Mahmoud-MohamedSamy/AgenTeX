const fs=require('fs');const L=JSON.parse(fs.readFileSync('../out/lead.json','utf8'));const o={};const S='../screenshots/';
const CRM='https://staging-crm.taviportal.com';await page.setViewportSize({width:1600,height:1000});
const txt=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const net=[];page.on('response',async r=>{const u=r.url();if(/\/(emails\/sendability|mail\/drafts)/.test(u)&&r.request().method()!=='OPTIONS'){let t='';try{t=(await r.text()).slice(0,260)}catch(e){}net.push(r.status()+' '+r.request().method()+' '+u.split('/api/v1')[1]+' '+t);}});
await page.goto(CRM+'/modules/'+L.module+'/records/'+L.id,{waitUntil:'commit',timeout:180000});
for(let i=0;i<50;i++){await page.waitForTimeout(3000);if(/QA RT13 2630 lead/.test(await txt()))break;}
await page.waitForTimeout(3000);o.url=page.url().replace(CRM,'');await page.screenshot({path:S+'t1-lead.png'});
o.buttons=await page.$$eval('main button, header button',e=>[...new Set(e.map(x=>(x.innerText||x.getAttribute('aria-label')||'').trim()).filter(Boolean))].slice(0,50));
o.net=net;return o;
