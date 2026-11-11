// T-04 owner cases: 01 (Marketing phone), 03 required fields, 04 long subject, 06 template picker, 07 reload, 09 Arabic, 10 side effects.
const L=require('./lib');
module.exports=async()=>{const R={};const cases={};const C=(k,v)=>{cases[k]=v;};
 const save=async()=>{await pg.getByRole('button',{name:/^Save$/}).click();await pg.waitForTimeout(8000);return pg.url();};
 const errs=async()=>pg.evaluate(()=>[...document.querySelectorAll('[role=alert],[data-sonner-toast],.text-red-600,[class*=error],[class*=destructive]')].map(e=>e.innerText.trim()).filter(Boolean).slice(0,10));
 // 01
 await L.gotoNew();R.d=await L.pickF('department','Marketing');R.c=await L.pickF('contact_id','QA MAN Contact 1');
 await pg.locator('[data-rule-field="subject"] input').first().fill('QA MAN phone 01');await pg.locator('[data-rule-field="description"] textarea').first().fill('Caller asks about refund');
 R.ch=await L.pickF('channel','Phone');R.statusDefault=(await pg.locator('[data-rule-field="status"]').innerText()).replace(/\s+/g,' ');
 const u1=await save();R.u1=u1;R.err1=await errs();await L.shot('t04-01-required-status');
 if(/records\/new/.test(u1)){R.st=await L.pickF('status','Open');const u=await save();R.u1b=u;}
 await L.shot('t04-01-after');const f=(await L.findTicket('QA MAN phone 01')).filter(o=>o.department===L.D.MK);
 R.t01=f.map(o=>({id:o.id,no:o.ticket_number,channel:o.channel,status:o.status,priority:o.priority}));
 if(f[0]){LED('T-04-01 ticket "QA MAN phone 01" (Marketing) '+f[0].id+' #'+f[0].ticket_number);
  // 07 reload
  await L.gotoTicket(f[0].id);await pg.reload({waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(4000);
  const t=await L.body_txt();R.t07={subject:t.includes('QA MAN phone 01'),desc:t.includes('Caller asks about refund'),phone:/Phone/.test(t),mk:/Marketing/.test(t),no:t.includes(String(f[0].ticket_number))};await L.shot('t04-07-reload');
  // 10 side effects
  await W(15000);const a=((await api('GET','/desk/tickets/'+f[0].id+'/activity')).j||{}).data;R.t10=(Array.isArray(a)?a:[]).map(x=>x.action);
  const rec=fl((await api('GET','/modules/'+T+'/records/'+f[0].id)).j.data);R.t10tags=rec.tags;
  const acts=await api('GET','/desk/tickets/'+f[0].id+'/activities');R.t10acts=acts.s+' '+JSON.stringify(arr(acts.j&&acts.j.data)).slice(0,200);}
 // 03 required
 await L.gotoNew();const u3=await save();R.t03={url:u3,stayed:/records\/new/.test(u3),errs:await errs(),text:(await L.body_txt()).match(/This field is required/g)};await L.shot('t04-03-required');
 const clr=pg.locator('[data-rule-field="department"] [aria-label="Clear"]');R.t03clear=await clr.count();if(R.t03clear){await clr.first().click();await pg.waitForTimeout(800);await pg.locator('[data-rule-field="subject"] input').first().fill('QA MAN nodept');R.st3=await L.pickF('status','Open');const u=await save();R.t03b={url:u,stayed:/records\/new/.test(u),errs:await errs()};await L.shot('t04-03-nodept');
  if(!R.t03b.stayed){const g=await L.findTicket('QA MAN nodept');R.t03b.made=g.map(o=>o.id+' dept '+o.department);g.forEach(o=>LED('T-04-03 ticket "QA MAN nodept" '+o.id));}}
 // 04 long subject
 const base='QA MAN long عربي 😀 <b>x</b> ';const s255=(base+'y'.repeat(300)).slice(0,255);const s1000=('QA MAN long1000 '+'z'.repeat(1100)).slice(0,1000);
 await L.gotoNew();await L.pickF('department','Marketing');await pg.locator('[data-rule-field="subject"] input').first().fill(s255);await L.pickF('status','Open');const u4=await save();R.t04a={url:u4,errs:await errs()};
 const g4=(await api('GET','/modules/'+T+'/records?page=1&per_page=20&q='+encodeURIComponent('QA MAN long'))).j;const l4=arr(g4&&g4.data).map(fl).filter(o=>String(o.subject).startsWith('QA MAN long عربي'));
 R.t04a.saved=l4.map(o=>({id:o.id,len:[...String(o.subject)].length,same:o.subject===s255}));l4.forEach(o=>LED('T-04-04 ticket 255 '+o.id));
 if(l4[0]){await L.gotoTicket(l4[0].id);R.t04a.bold=await pg.evaluate(()=>[...document.querySelectorAll('b')].some(b=>b.innerText==='x'));R.t04a.textShown=(await L.body_txt()).includes('<b>x</b>');await L.shot('t04-04-255');}
 await L.gotoNew();await L.pickF('department','Marketing');await pg.locator('[data-rule-field="subject"] input').first().fill(s1000);R.t04b_inputLen=(await pg.locator('[data-rule-field="subject"] input').first().inputValue()).length;await L.pickF('status','Open');const u4b=await save();
 R.t04b={url:u4b,stayed:/records\/new/.test(u4b),errs:await errs(),msg:(await L.body_txt()).match(/[^.]{0,60}(characters|too long|maximum|at most)[^.]{0,60}/ig)};await L.shot('t04-04-1000');
 const g4b=arr(((await api('GET','/modules/'+T+'/records?page=1&per_page=20&q='+encodeURIComponent('QA MAN long1000'))).j||{}).data).map(fl);R.t04b.saved=g4b.map(o=>({id:o.id,len:String(o.subject).length}));g4b.forEach(o=>LED('T-04-04 ticket 1000 '+o.id));
 // 06 template picker present on the form?
 await L.gotoNew();R.t06={templateUI:(await L.body_txt()).match(/[^ ]{0,20}[Tt]emplate[^ ]{0,30}/g)};const tpl=await api('GET','/desk/ticket-templates');R.t06.api=tpl.s+' '+tpl.t.slice(0,200);
 // 09 Arabic
 const lang=pg.getByRole('button',{name:/^EN$/}).first();if(await lang.count()){await lang.click();await pg.waitForTimeout(1500);const ar=pg.getByRole('menuitem',{name:/عربي|العربية|Arabic/}).first();R.t09menu=await pg.locator('[role=menuitem],[role=option]').allInnerTexts().catch(()=>[]);
  if(await ar.count()){await ar.click();await pg.waitForTimeout(5000);await L.gotoNew();R.t09={dir:await pg.evaluate(()=>document.documentElement.dir||getComputedStyle(document.body).direction),raw:(await L.body_txt()).match(/\b[a-z]+\.[a-z_]+\.[a-z_.]+\b/g),sample:(await L.body_txt()).slice(0,600)};await L.shot('t04-09-ar-form');
   await L.pickF('department','Marketing');await pg.locator('[data-rule-field="subject"] input').first().fill('QA MAN AR 01');R.t09st=await L.pickF('status','مفتوح');if(R.t09st!=='ok')R.t09st2=await L.pickF('status','Open');
   await pg.locator('[data-rule-field="subject"]').scrollIntoViewIfNeeded();const sv=pg.getByRole('button',{name:/^(حفظ|Save)$/}).last();await sv.click();await pg.waitForTimeout(3000);R.t09toast=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=status],[role=alert]')].map(e=>e.innerText).join(' | '));await pg.waitForTimeout(5000);await L.shot('t04-09-ar-saved');
   const g9=await L.findTicket('QA MAN AR 01');R.t09saved=g9.map(o=>o.id);g9.forEach(o=>LED('T-04-09 ticket "QA MAN AR 01" '+o.id));
   const en=pg.getByRole('button',{name:/^(AR|ع|عربي)$/}).first();R.t09back=await en.count();}}
 return R;};
