const fs=require('fs');const L=JSON.parse(fs.readFileSync('../out/lead.json','utf8'));const o={};const S='../screenshots/';const CRM='https://staging-crm.taviportal.com';const C=CRM+'/api/v1';await page.setViewportSize({width:1600,height:1000});
const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token');const txt=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const net=[];page.on('response',async r=>{if(r.request().method()==='POST'&&/\/mail\//.test(r.url())){let t='';try{t=(await r.text()).slice(0,200)}catch(e){}net.push(r.status()+' '+r.url().split('/api/v1')[1].replace(/[0-9a-f-]{36}/g,'<id>')+' '+t);}});
await page.goto(CRM+'/modules/'+L.module+'/records/'+L.id,{waitUntil:'commit',timeout:180000});
for(let i=0;i<50;i++){await page.waitForTimeout(3000);if(/Send Email/.test(await txt()))break;}
await page.locator('main').getByText('Emails',{exact:true}).first().click({timeout:15000});for(let i=0;i<15;i++){await page.waitForTimeout(2000);if(await page.getByRole('button',{name:'Retry'}).count())break;}
await page.getByRole('button',{name:'Retry'}).first().click({timeout:15000});
const seen=[];for(let i=0;i<16;i++){await page.waitForTimeout(500);for(const t of await page.locator('[role=alert],[role=status],[data-sonner-toast]').allInnerTexts().catch(()=>[])){const c=t.replace(/\s+/g,' ').trim();if(c&&!seen.includes(c))seen.push(c);}if(i===4)await page.screenshot({path:S+'t6-retry.png'});}
o.toasts=seen;o.net=net;await page.waitForTimeout(8000);
const g=async p=>{const r=await ctx.request.fetch(C+p,{headers:{authorization:'Bearer '+tok.value}});return r.text();};
o.mails=arr(JSON.parse(await g('/mail/records/leads/'+L.id+'/emails?box=mails&limit=10')).data).map(e=>e.subject+' | '+e.status);
o.timeline=((await g('/timeline/records/leads/'+L.id+'/feed')).match(/"entry_type":"(\w+)"/g)||[]).map(x=>x.slice(14,-1));
return o;
