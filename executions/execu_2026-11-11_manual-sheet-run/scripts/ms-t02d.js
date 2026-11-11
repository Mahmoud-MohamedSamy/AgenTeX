// T-02-06 mode kept after reload + new sign-in (checked in a second run), T-02-07 Arabic board + drag.
const L=require('./lib');
module.exports=async()=>{const R={};const toast=async()=>{let s='';for(let i=0;i<12&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const open=async()=>{await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>document.querySelectorAll('[data-board-card-id]').length>3||/Classic View|Table View|Compact View/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(3000);};
 const modeNow=async()=>(await pg.getByRole('button',{name:/Classic View|Compact View|Table View|Status Mode|العرض|وضع/}).first().innerText().catch(()=>'?')).trim();
 if(process.env.CHECK){await open();R.modeAfterSignin=await modeNow();R.cards=await pg.locator('[data-board-card-id]').count();await L.shot('t02-06-after-signin');return R;}
 await open();if(!/Status Mode/.test(await modeNow())){await pg.getByRole('button',{name:/Classic View|Compact View|Table View/}).first().click();await pg.waitForTimeout(1000);await pg.locator('[role=menuitem],[role=menuitemradio],[role=option]').filter({hasText:/^Status Mode$/}).first().click();await pg.waitForTimeout(5000);}
 await pg.reload({waitUntil:'commit'});await pg.waitForTimeout(9000);R.modeAfterReload=await modeNow();
 // Arabic
 await pg.getByRole('button',{name:/^EN$/}).first().click();await pg.waitForTimeout(1200);await pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'العربية'}).first().click();await pg.waitForTimeout(6000);await open();
 const lanes=await pg.evaluate(()=>{const c=[...document.querySelectorAll('[data-board-card-id]')];const xs={};c.forEach(e=>{const t=e.closest('section,[data-lane-id],[role=list]')||e.parentElement;});return null;});
 R.ar={dir:await pg.evaluate(()=>document.documentElement.dir),heads:(await L.body_txt()).match(/(مفتوحة|معلقة|مصعّدة|حالة أخرى|حالات أخرى)[^ ]{0,3} ?[٠-٩0-9]*/g)};
 const pos=async n=>{const h=pg.locator('main').getByText(n,{exact:true}).first();const b=await h.boundingBox().catch(()=>null);return b&&Math.round(b.x);};
 R.ar.x={open:await pos('مفتوحة'),hold:await pos('معلقة')};await L.shot('t02-07-ar-board');
 const card=pg.locator('[data-board-card-id]').filter({hasText:'QA MAN mode 4'}).first();await card.scrollIntoViewIfNeeded().catch(()=>{});const s=await card.boundingBox();const h=pg.locator('main').getByText('معلقة',{exact:true}).first();const d=await h.boundingBox().catch(()=>null);
 if(s&&d){await pg.mouse.move(s.x+s.width/2,s.y+s.height/2);await pg.mouse.down();await pg.mouse.move(s.x+s.width/2-15,s.y+s.height/2+15,{steps:6});await pg.mouse.move(d.x+d.width/2,d.y+140,{steps:30});await pg.waitForTimeout(500);await pg.mouse.up();R.ar.dragToast=await toast();await pg.waitForTimeout(3000);}
 R.ar.after=((await L.findTicket('QA MAN mode 4'))[0]||{}).status;await L.shot('t02-07-ar-dragged');
 const back=pg.getByRole('button',{name:/^AR$/}).first();if(await back.count()){await back.click();await pg.waitForTimeout(1200);await pg.locator('[role=menuitem],[role=menuitemradio],[role=option],button').filter({hasText:'English'}).first().click();await pg.waitForTimeout(4000);}
 return R;};
