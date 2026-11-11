// T-04-06 template via header "+" dropdown, T-04-09 Arabic create, then back to EN.
const L=require('./lib');
module.exports=async()=>{const R={};
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>document.body.innerText.includes('New Ticket'),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2000);
 // split button next to New Ticket / header +
 const nt=pg.getByRole('button',{name:/^New Ticket$/}).first();R.nt=await nt.count();
 const sib=pg.locator('xpath=//button[normalize-space()="New Ticket"]/following-sibling::button[1]');R.sib=await sib.count();
 if(R.sib){await sib.first().click();await pg.waitForTimeout(1500);R.ntMenu=await pg.locator('[role=menuitem],[role=option]').allInnerTexts().catch(()=>[]);await L.shot('t04-06-newticket-menu');await pg.keyboard.press('Escape');}
 const hdr=pg.locator('header button[aria-haspopup]').filter({hasNotText:/EN/}).first();
 const plusArrow=pg.locator('xpath=(//header//button[@aria-haspopup="menu"])[1]');R.plusArrow=await plusArrow.count();
 if(R.plusArrow){await plusArrow.click();await pg.waitForTimeout(1500);R.plusMenu=await pg.locator('[role=menuitem]').allInnerTexts().catch(()=>[]);await L.shot('t04-06-plus-menu');await pg.keyboard.press('Escape');}
 // template picker
 const mi=pg.getByRole('menuitem',{name:/template/i}).first();
 if(R.sib){await sib.first().click();await pg.waitForTimeout(1200);if(await mi.count()){await mi.click();await pg.waitForTimeout(3000);R.tplDialog=(await L.body_txt()).match(/.{0,200}QA GL W2 template.{0,200}/)?.[0];await L.shot('t04-06-picker');}else await pg.keyboard.press('Escape');}
 // Arabic
 await L.gotoNew();const lang=pg.getByRole('button',{name:/^EN$/}).first();if(await lang.count()){await lang.click();await pg.waitForTimeout(1500);const ar=pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'العربية'}).first();R.arCount=await ar.count();
  if(R.arCount){await ar.click();await pg.waitForTimeout(6000);await L.gotoNew();const t=await L.body_txt();R.t09={dir:await pg.evaluate(()=>document.documentElement.dir||getComputedStyle(document.body).direction),raw:t.match(/\b[a-z]+(\.[a-z_]+){2,}\b/g),english:t.match(/\b(Contact|Department|Subject|Description|Status|Save|Cancel|Ticket Information|Choose a record)\b/g),sample:t.slice(0,700)};await L.shot('t04-09-ar-form');
   R.dep=await L.pickF('department','Marketing');await pg.locator('[data-rule-field="subject"] input').first().fill('QA MAN AR 01');R.stOpts=(await L.optsF('status')).slice(0,6);R.st=await L.pickF('status',R.stOpts[0]||'Open');
   const sv=pg.locator('xpath=//button[normalize-space()="حفظ" or normalize-space()="Save"]').last();R.saveLabel=await sv.innerText().catch(()=>null);await sv.click();
   let toast='';for(let i=0;i<10&&!toast;i++){await pg.waitForTimeout(500);toast=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=status],[role=alert],[aria-live]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}R.toast=toast;
   await pg.waitForTimeout(6000);await L.shot('t04-09-ar-saved');R.page=(await L.body_txt()).slice(0,400);
   const g9=await L.findTicket('QA MAN AR 01');R.saved=g9.map(o=>o.id);g9.forEach(o=>LED('T-04-09 ticket "QA MAN AR 01" '+o.id));
   const back=pg.getByRole('button',{name:/^AR$/}).first();if(await back.count()){await back.click();await pg.waitForTimeout(1200);const en=pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'English'}).first();if(await en.count()){await en.click();await pg.waitForTimeout(4000);R.backToEN=true;}}}}
 return R;};
