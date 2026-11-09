const fs=require('fs');const L=JSON.parse(fs.readFileSync('../out/lead.json','utf8'));const o={};const S='../screenshots/';
const CRM='https://staging-crm.taviportal.com';await page.setViewportSize({width:1600,height:1000});
const txt=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const net=[];page.on('response',async r=>{const u=r.url();if(/\/(emails\/sendability|mail\/drafts|mail\/send)/.test(u)){let t='';try{t=(await r.text()).slice(0,300)}catch(e){}net.push(r.status()+' '+r.request().method()+' '+u.split('/api/v1')[1]+' '+t);}});
await page.goto(CRM+'/modules/'+L.module+'/records/'+L.id,{waitUntil:'commit',timeout:180000});
for(let i=0;i<50;i++){await page.waitForTimeout(3000);if(/Send Email/.test(await txt()))break;}
await page.getByRole('button',{name:'Send Email'}).first().click({timeout:20000});await page.waitForTimeout(7000);
const dlg=page.locator('[role=dialog]').last();o.dialog=(await dlg.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,900);await page.screenshot({path:S+'t2-compose.png'});
o.dlgButtons=await dlg.locator('button').evaluateAll(e=>e.map(x=>(x.innerText||x.getAttribute('aria-label')||'').trim()+(x.disabled?' (disabled)':'')).filter(Boolean)).catch(()=>[]);
o.inputs=await dlg.locator('input,textarea,[contenteditable=true]').evaluateAll(e=>e.map(x=>x.tagName+'|'+(x.placeholder||x.getAttribute('aria-label')||x.name||'')+'|'+(x.disabled?'disabled':''))).catch(()=>[]);
o.net=net;return o;
