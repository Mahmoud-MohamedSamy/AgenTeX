// NDC-2813 retest 8 Nov: New Ticket form owner (metadata-engine #213) + NDC-2275 cleared-owner RR case + direct rule override.
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O (creator)';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
await page.setViewportSize({width:1600,height:1000});const o={};const RAW=RUN+'/screenshots/raw/';const shot=n=>page.screenshot({path:RAW+n+'.png'});
const field=lbl=>page.locator('main').locator('div').filter({has:page.locator('label',{hasText:new RegExp('^[*]?'+lbl+'$')})}).last();
const reqs=[];page.on('request',r=>{if(r.method()==='POST'&&/\/records$/.test(r.url()))reqs.push((r.postData()||'').slice(0,2500));});
const form=async(subject,clear,tag)=>{reqs.length=0;const x={subject};globalThis.X=x;
 await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'commit'});await page.waitForFunction(()=>/Ticket Information/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await page.waitForTimeout(3000);
 x.step='dept';await field('Department').getByText('Customer Support').first().click();await page.waitForTimeout(800);await page.getByRole('option',{name:'QA AS6 Dept A'}).first().click();await page.waitForTimeout(1200);
 x.step='subject';await field('Subject').locator('input').first().fill(subject);
 const st=field('Status');if(/Select/.test(await st.innerText())){await st.getByText('Select').first().click();await page.waitForTimeout(600);await page.getByRole('option',{name:/^Open$/}).first().click();await page.waitForTimeout(500);}
 x.ownerShown=(await field('Ticket Owner').innerText()).replace(/\s+/g,' ');
 if(clear){const f=field('Ticket Owner');x.ownerButtons=await f.locator('button').evaluateAll(b=>b.map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim()).slice(0,6));
  const c=f.locator('[aria-label="Clear selection"]');x.step="clear "+(await c.count());if(await c.count()){await c.first().click({timeout:15000}).catch(async e=>{x.clearErr=String(e.message).slice(0,120);await c.first().dispatchEvent("click");});}else{x.clearFallback='keyboard';await f.locator('input,[role=combobox]').first().click().catch(()=>{});await page.keyboard.press('Backspace');await page.keyboard.press('Escape');}
  await page.waitForTimeout(800);x.ownerAfterClear=(await f.innerText()).replace(/\s+/g,' ');}
 await shot(tag+'-form');
 x.step='save';await page.getByRole('button',{name:/^Save$/}).last().click();await page.waitForTimeout(7000);
 const id=(page.url().match(/([0-9a-f]{8}-[0-9a-f-]{27})/)||[])[1];x.id=id;if(id)LED('ticket "'+subject+'" '+id+' NDC-2813 form');
 x.postOwner=reqs.map(b=>/"field":"owner"/.test(b)?(b.match(/"field":"owner".{0,100}/)||[''])[0]:'no owner field in POST');
 if(id){await page.waitForTimeout(3000);const w=await own(id);x.ownerSaved=nm(w.owner);x.hist=(await hist(id)).slice(0,3);const tk=await getT(id);x.no=tk.ticket_number;
  await page.reload({waitUntil:'commit'});await page.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);await shot(tag+'-saved');
  const h=page.getByRole('tab',{name:/History/i});if(await h.count()){await h.first().click();await page.waitForTimeout(3500);await shot(tag+'-history');}}
 return x;};
const seq0=(await getRule(IDS.RR_SEQ)).execute_on;let dr=null;
try{
 o.exec=(await putRule(IDS.RR_SEQ,{execute_on:['create','update']})).s;LED('NDC-2813 b: RR_SEQ execute_on create+update temporarily');
 try{o['B cleared owner (NDC-2275 case)']=await form('QA AS6 SEQ RT14 2813 form owner cleared r2',true,'2813-b');}catch(e){o.Berr=String(e.message).slice(0,150);o.Bx=globalThis.X;await shot('2813-b-err');}
 o['B2 cleared owner, no rule match']=await form('QA RT14 2813 form owner cleared nomatch',true,'2813-b2');
}finally{
  o.execBack=(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s;LED('NDC-2813: RR_SEQ execute_on restored');
}
fs.writeFileSync(RUN+'/out/t2813b.json',JSON.stringify(o,null,1));return o;
