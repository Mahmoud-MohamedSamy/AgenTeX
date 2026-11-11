// T-13-03 table view priority column; T-13-08 Arabic status list + close dialog; prep Agent C ticket for T-13-07.
const L=require('./lib');
module.exports=async()=>{const R={};let step='';
 try{
 step='03';await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/QA MAN status 01/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});
 await pg.getByRole('button',{name:/Classic View|Table View|Compact View/}).first().click();await pg.waitForTimeout(1200);R.views=await pg.locator('[role=menuitem],[role=menuitemradio],[role=option]').allInnerTexts();
 const tv=pg.locator('[role=menuitem],[role=menuitemradio],[role=option]').filter({hasText:/Table/}).first();if(await tv.count()){await tv.click();await pg.waitForTimeout(6000);R.headers=await pg.evaluate(()=>[...document.querySelectorAll('th')].map(t=>t.innerText.trim()).filter(Boolean));R.row=(await pg.locator('tr').filter({hasText:'QA MAN status 01'}).first().innerText().catch(()=>'')).replace(/\s+/g,' ');await L.shot('t13-03-table');
  await pg.getByRole('button',{name:/Table View/}).first().click().catch(()=>{});await pg.waitForTimeout(800);const cv=pg.locator('[role=menuitem],[role=menuitemradio],[role=option]').filter({hasText:/Classic/}).first();if(await cv.count())await cv.click();await pg.waitForTimeout(2000);}
 else await pg.keyboard.press('Escape');
 step='08';const id=(await L.findTicket('QA MAN status 01'))[0].id;
 const lang=pg.getByRole('button',{name:/^EN$/}).first();await lang.click();await pg.waitForTimeout(1200);await pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'العربية'}).first().click();await pg.waitForTimeout(5000);
 await L.gotoTicket(id);const sb=pg.locator('button[aria-label^="الحالة"], button[aria-label^="Status"]').first();R.sbCount=await sb.count();
 if(R.sbCount){await sb.click();await pg.waitForTimeout(1500);R.arStatuses=(await pg.locator('[role=option],[role=menuitem],[role=menuitemradio]').allInnerTexts()).slice(0,8);await L.shot('t13-08-ar-status');await pg.keyboard.press('Escape');}
 const cl=pg.locator('button').filter({hasText:/إغلاق التذكرة|إغلاق/}).last();R.closeBtn=await cl.count();if(R.closeBtn){await cl.click();await pg.waitForTimeout(1500);const d=pg.locator('[role=dialog],[role=alertdialog]').last();R.arDialog={text:(await d.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,200),dir:await d.evaluate(e=>getComputedStyle(e).direction).catch(()=>null)};await L.shot('t13-08-ar-close');await d.getByRole('button').first().click().catch(()=>{});await pg.keyboard.press('Escape');}
 const back=pg.getByRole('button',{name:/^AR$/}).first();if(await back.count()){await back.click();await pg.waitForTimeout(1200);await pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'English'}).first().click();await pg.waitForTimeout(4000);}
 step='07prep';let t=(await L.findTicket('QA MAN agent close'))[0];if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN agent close',department:L.D.CS,status:'Open'}));t={id:c.j.data.id};LED('T-13-07 ticket "QA MAN agent close" '+t.id);}
 R.assign=(await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:'9d182dfa-05f3-4af7-9685-8615a2fbe537',team_id:null})).s;require('fs').writeFileSync(OUT+'/t13-agent.json',JSON.stringify({id:t.id}));
 }catch(x){R.err=step+': '+String(x.message).slice(0,140);await L.shot('t13-err');}return R;};
