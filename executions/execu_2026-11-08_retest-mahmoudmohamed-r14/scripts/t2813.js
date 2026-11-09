// NDC-2813 retest 8 Nov: New Ticket form owner (metadata-engine #213) + NDC-2275 cleared-owner RR case + direct rule override.
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O (creator)';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
await page.setViewportSize({width:1600,height:1000});const o={};const RAW=RUN+'/screenshots/raw/';const shot=n=>page.screenshot({path:RAW+n+'.png'});
const field=lbl=>page.locator('main').locator('div').filter({has:page.locator('label',{hasText:new RegExp('^[*]?'+lbl+'$')})}).last();
const reqs=[];page.on('request',r=>{if(r.method()==='POST'&&/\/records$/.test(r.url()))reqs.push((r.postData()||'').slice(0,2500));});
const form=async(subject,clear,tag)=>{reqs.length=0;const x={subject};
 await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'commit'});await page.waitForFunction(()=>/Ticket Information/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await page.waitForTimeout(3000);
 await field('Department').getByText('Customer Support').first().click();await page.waitForTimeout(800);await page.getByRole('option',{name:'QA AS6 Dept A'}).first().click();await page.waitForTimeout(1200);
 await field('Subject').locator('input').first().fill(subject);
 const st=field('Status');if(/Select/.test(await st.innerText())){await st.getByText('Select').first().click();await page.waitForTimeout(600);await page.getByRole('option',{name:/^Open$/}).first().click();await page.waitForTimeout(500);}
 x.ownerShown=(await field('Ticket Owner').innerText()).replace(/\s+/g,' ');
 if(clear){const f=field('Ticket Owner');x.ownerButtons=await f.locator('button').evaluateAll(b=>b.map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim()).slice(0,6));
  const c=f.locator('button[aria-label*="lear" i], button[aria-label*="emove" i], [data-testid*="clear" i]');if(await c.count()){await c.first().click();}else{x.clearFallback='keyboard';await f.locator('input,[role=combobox]').first().click().catch(()=>{});await page.keyboard.press('Backspace');await page.keyboard.press('Escape');}
  await page.waitForTimeout(800);x.ownerAfterClear=(await f.innerText()).replace(/\s+/g,' ');}
 await shot(tag+'-form');
 await page.getByRole('button',{name:/^Save$/}).last().click();await page.waitForTimeout(7000);
 const id=(page.url().match(/([0-9a-f]{8}-[0-9a-f-]{27})/)||[])[1];x.id=id;if(id)LED('ticket "'+subject+'" '+id+' NDC-2813 form');
 x.postOwner=reqs.map(b=>/"field":"owner"/.test(b)?(b.match(/"field":"owner".{0,100}/)||[''])[0]:'no owner field in POST');
 if(id){await page.waitForTimeout(3000);const w=await own(id);x.ownerSaved=nm(w.owner);x.hist=(await hist(id)).slice(0,3);const tk=await getT(id);x.no=tk.ticket_number;
  await page.reload({waitUntil:'commit'});await page.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);await shot(tag+'-saved');
  const h=page.getByRole('tab',{name:/History/i});if(await h.count()){await h.first().click();await page.waitForTimeout(3500);await shot(tag+'-history');}}
 return x;};
const seq0=(await getRule(IDS.RR_SEQ)).execute_on;let dr=null;
try{
 o['A untouched owner']=await form('QA RT14 2813 form owner untouched',false,'2813-a');
 o.exec=(await putRule(IDS.RR_SEQ,{execute_on:['create','update']})).s;LED('NDC-2813: RR_SEQ execute_on create+update temporarily');
 o['B cleared owner (NDC-2275 case)']=await form('QA AS6 SEQ RT14 2813 form owner cleared',true,'2813-b');
 o['C untouched owner + RR match']=await form('QA AS6 SEQ RT14 2813 form untouched rr',false,'2813-c');
 const r=await mkRule({type:'direct',name:'QA RT14 2813 direct',description:'QA retest NDC-2813 8 Nov - safe to delete',is_active:true,execute_on:['create'],targets:[DT('QA RT14 2813 direct',IDS.DA,null,AG(IDS.A3))]},'NDC-2813');dr=r.id;NEW.R2813=r.id;o.directRule=r.s+' '+(r.e||'');
 o['D untouched owner + direct rule to A3']=await form('QA RT14 2813 direct form untouched',false,'2813-d');
 // API creates
 const api1=async(sub,src)=>{const b={...body({subject:sub,department:IDS.DA,status:'Open',priority:'Medium',email:'qa.rt14@example.com'}),...(src?{source:src}:{})};const rr=await api('POST','/modules/'+T+'/records',b);const id=rr.j?.data?.id;if(id)LED('ticket "'+sub+'" '+id+' NDC-2813 api');await sleep(4500);const tk=await getT(id);return {s:rr.s,no:tk.ticket_number,owner:nm((await own(id)).owner),id};};
 o['E api source=api no owner, RR match']=await api1('QA AS6 SEQ RT14 2813 api source',  'api');
 o['F api source=web_form no owner, RR match']=await api1('QA AS6 SEQ RT14 2813 api webform','web_form');
 o['G api no source no owner']=await api1('QA RT14 2813 api plain',null);
 o['H api source=api, direct rule']=await api1('QA RT14 2813 direct api source','api');
}finally{
 if(dr){o.drOff=(await setActive(dr,false)).s;LED('NDC-2813: rule QA RT14 2813 direct deactivated');}
 o.execBack=(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s;LED('NDC-2813: RR_SEQ execute_on restored');
}
// NDC-2811 evidence: history of #1340 (A2 skipped)
const t2811=JSON.parse(fs.readFileSync(RUN+'/out/t2811.json','utf8'));const sk=t2811.a2EmailOff[1];
await page.goto(H+'/views/all/tickets/'+sk.id,{waitUntil:'commit'});await page.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const h=page.getByRole('tab',{name:/History/i});if(await h.count()){await h.first().click();await page.waitForTimeout(3500);}await shot('2811-history-skipped');o.h2811=(await page.innerText('main')).replace(/\s+/g,' ').match(/.{0,200}(?:skip|Skip|SKIP).{0,200}/)?.[0];
fs.writeFileSync(RUN+'/out/t2813.json',JSON.stringify(o,null,1));return o;
