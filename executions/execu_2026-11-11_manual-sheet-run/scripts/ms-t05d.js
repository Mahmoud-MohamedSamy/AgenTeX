// T-05-02 inline edits (subject, due date tomorrow 17:00, priority Low), T-05-03 history, T-05-04 due date yesterday, T-05-05 unknown id, T-05-07 reload.
const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/ms-t05a.json')).id;await L.gotoTicket(id);
 const toast=async()=>{let t='';for(let i=0;i<12&&!t;i++){await pg.waitForTimeout(400);t=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=status],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return t;};
 // subject
 await pg.getByRole('button',{name:'Edit the subject'}).click();await pg.waitForTimeout(1000);const inp=pg.locator('input:focus, main input[value="QA MAN phone 01"]').first();R.subjInput=await inp.count();
 if(R.subjInput){await inp.fill('QA MAN phone 01 edited');await pg.keyboard.press('Enter');R.subjToast=await toast();await pg.waitForTimeout(1500);}
 // due date tomorrow 17:00
 const now=new Date();const tom=new Date(now.getTime()+86400000);const day=String(tom.getDate());
 await pg.getByText('Due Date',{exact:true}).first().locator('xpath=..').click();await pg.waitForTimeout(1500);
 const cal=pg.locator('[role=dialog],[data-radix-popper-content-wrapper]').filter({hasText:'TIME'}).first();
 await cal.getByRole('button',{name:new RegExp('^'+day+'$')}).first().click().catch(async()=>{await cal.locator('button').filter({hasText:new RegExp('^'+day+'$')}).first().click();});
 const sels=cal.locator('select, button[role=combobox]');R.calSelects=await sels.count();
 if(await cal.locator('select').count()>=3){await cal.locator('select').nth(0).selectOption('05');await cal.locator('select').nth(1).selectOption('00');await cal.locator('select').nth(2).selectOption('PM');}
 await L.shot('t05-02-due-set');await cal.getByRole('button',{name:/^Set$/}).click();R.dueToast=await toast();await pg.waitForTimeout(1500);
 R.dueShown=(await L.body_txt()).match(/Due Date [^A-Z]{0,30}/)?.[0];
 // priority Low
 await pg.getByRole('button',{name:'Edit Priority'}).click();await pg.waitForTimeout(1200);
 const ps=pg.locator('[data-rule-field="priority"] button[role=combobox], [data-rule-field="priority"] button[aria-haspopup]').first();
 if(await ps.count()){await ps.click();}else{await pg.getByText('Select',{exact:true}).last().click();}await pg.waitForTimeout(1000);
 await pg.locator('[role=option]').filter({hasText:/^\s*Low\s*$/}).first().click().catch(()=>{});await pg.waitForTimeout(500);
 await pg.getByRole('button',{name:/^Save$/}).last().click();R.priToast=await toast();await pg.waitForTimeout(2000);await L.shot('t05-02-after');
 const o=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);R.api={subject:o.subject,due:o.due_date,priority:o.priority};
 // history
 const ht=pg.locator('[role=tab]').filter({hasText:/history/i}).first();await ht.click();await pg.waitForTimeout(4000);const ctl=await ht.getAttribute('aria-controls');
 R.history=await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,1500),ctl);await L.shot('t05-03-history');
 // 04 due yesterday
 await pg.getByText('Due Date',{exact:true}).first().locator('xpath=..').click();await pg.waitForTimeout(1500);const y=new Date(now.getTime()-86400000);const cal2=pg.locator('[role=dialog],[data-radix-popper-content-wrapper]').filter({hasText:'TIME'}).first();
 if(y.getMonth()!==now.getMonth())await cal2.locator('button').first().click();
 const yb=cal2.locator('button').filter({hasText:new RegExp('^'+y.getDate()+'$')}).first();R.yDisabled=await yb.isDisabled().catch(()=>null);await yb.click().catch(e=>R.yClickErr=String(e.message).slice(0,80));
 await cal2.getByRole('button',{name:/^Set$/}).click().catch(()=>{});R.pastToast=await toast();await pg.waitForTimeout(2000);await L.shot('t05-04-past');
 const o2=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);R.pastApi={due:o2.due_date,overdue:o2.is_overdue,status:o2.status};R.pastShown=(await L.body_txt()).match(/(Due Date [^A-Z]{0,40}|overdue[^.]{0,40})/ig);
 // 05 unknown id
 const bad=id.slice(0,-4)+(id.slice(-4)==='aaaa'?'bbbb':'aaaa');await pg.goto(H+'/views/all/tickets/'+bad,{waitUntil:'commit'}).catch(()=>{});await pg.waitForTimeout(12000);
 R.badPage=(await L.body_txt()).replace(/^.*?Scheduled Replies/,'').slice(0,400);await L.shot('t05-05-unknown');
 // 07 reload
 await L.gotoTicket(id);await pg.reload({waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(4000);
 const t7=await L.body_txt();R.reload={subject:t7.includes('QA MAN phone 01 edited'),due:(t7.match(/Due Date [^A-Z]{0,30}/)||[''])[0],low:/Priority Low/.test(t7)};await L.shot('t05-07-reload');
 return R;};
