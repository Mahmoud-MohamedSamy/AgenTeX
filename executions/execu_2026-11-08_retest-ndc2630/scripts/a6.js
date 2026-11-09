const fs=require('fs');const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');const L=JSON.parse(fs.readFileSync('../out/lead.json','utf8'));
const o={};const S='../screenshots/';const CRM='https://staging-crm.taviportal.com';const C=CRM+'/api/v1';await page.setViewportSize({width:1600,height:1000});
const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token');
const ca=async(m,p,b)=>{const r=await ctx.request.fetch(C+p,{method:m,headers:{authorization:'Bearer '+tok.value,'content-type':'application/json'},data:b?JSON.stringify(b):undefined,timeout:90000});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{s:r.status(),j,t};};
// 1) real recipient named in the ticket, API past the disabled button
const d=await ca('POST','/mail/drafts',{to:['mahmoud.mmohamedsamy@gmail.com'],subject:'QA RT13 2630 refused-sender check',body:'QA NDC-2630 test, please ignore',body_html:'<p>QA NDC-2630 test, please ignore</p>',record_type:'leads',record_id:L.id,attachments:[]});const id=d.j&&d.j.data&&d.j.data.id;LED('mail draft '+id+' to ticket test address');
const s=await ca('POST','/mail/drafts/'+id+'/send',{});o.realSend=s.s+' '+((s.j&&s.j.error&&(s.j.error.code+' — '+s.j.error.message))||s.t.slice(0,160));
// 2) screen: override the pre-check in this browser only, so Send is enabled and the server's real failure reaches the UI
await page.route('**/emails/sendability*',async r=>{const res=await r.fetch();const j=await res.json();j.data={...j.data,can_send:true,reason:null,detail:null,provider:'smtp'};await r.fulfill({response:res,json:j});});
const txt=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const net=[];page.on('response',async r=>{if(/\/mail\/drafts.*\/send/.test(r.url())){let t='';try{t=(await r.text()).slice(0,220)}catch(e){}net.push(r.status()+' '+t);}});
await page.goto(CRM+'/modules/'+L.module+'/records/'+L.id,{waitUntil:'commit',timeout:180000});
for(let i=0;i<50;i++){await page.waitForTimeout(3000);if(/Send Email/.test(await txt()))break;}
await page.getByRole('button',{name:'Send Email'}).first().click({timeout:20000});await page.waitForTimeout(6000);
const dlg=page.locator('[role=dialog]').last();await dlg.locator('input[placeholder="Subject"]').fill('QA RT13 2630 screen failure check');
const send=dlg.getByRole('button',{name:'Send',exact:true});o.sendEnabled=await send.isEnabled();await send.click({timeout:20000});
const seen=[];for(let i=0;i<14;i++){await page.waitForTimeout(500);const toasts=await page.locator('[role=alert],[role=status],[data-sonner-toast],.toast').allInnerTexts().catch(()=>[]);for(const t of toasts){const c=t.replace(/\s+/g,' ').trim();if(c&&!seen.includes(c))seen.push(c);}if(i===3)await page.screenshot({path:S+'t3-send-result.png'});}
o.toasts=seen;o.net=net;o.dialogOpen=await page.locator('[role=dialog]').count();o.dialogText=(await dlg.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,260);await page.screenshot({path:S+'t3b-after-send.png'});
await page.keyboard.press('Escape');await page.waitForTimeout(1500);const canc=page.locator('[role=dialog] button:has-text("Cancel")');if(await canc.count())await canc.last().click().catch(()=>{});await page.waitForTimeout(1500);
const discard=page.locator('[role=dialog] button:has-text("Discard")');if(await discard.count())await discard.last().click().catch(()=>{});
await page.getByRole('tab',{name:/Emails/}).or(page.getByRole('button',{name:'Emails'})).first().click({timeout:15000}).catch(e=>o.tabErr=e.message.slice(0,80));await page.waitForTimeout(6000);o.emailsTab=(await page.locator('main').innerText().catch(()=>'')).replace(/\s+/g,' ').match(/(QA RT13 2630.{0,300})/)?.[1]||'';await page.screenshot({path:S+'t4-emails-tab.png'});
await page.getByRole('tab',{name:/Timeline/}).or(page.getByRole('button',{name:'Timeline'})).first().click({timeout:15000}).catch(e=>o.tabErr2=e.message.slice(0,80));await page.waitForTimeout(6000);await page.screenshot({path:S+'t5-timeline-tab.png'});
const tl=await ctx.request.fetch(C+'/timeline/records/leads/'+L.id+'/feed',{headers:{authorization:'Bearer '+tok.value}});o.timeline=((await tl.text()).match(/"entry_type":"(\w+)"/g)||[]).map(x=>x.slice(14,-1));
const box=await ca('GET','/mail/records/leads/'+L.id+'/emails?box=mails&limit=10');o.mails=arr(box.j&&box.j.data).map(e=>e.subject+' | '+e.status+' | '+String(e.last_error||'').slice(0,90));
return o;
