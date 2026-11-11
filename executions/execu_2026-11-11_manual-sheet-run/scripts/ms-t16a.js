// T-16: merge A+B via list selection; one-ticket merge; explore dialog; unmerge; different departments.
const L=require('./lib');
module.exports=async()=>{const R={};let step='';const toast=async()=>{let s='';for(let i=0;i<12&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const mk=async(s,dept,desc)=>{let t=(await L.findTicket(s))[0];if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:s,department:dept,status:'Open',channel:'email',contact_id:'bc1b1c62-c31a-40ec-a089-cfcdcc6864b1',description:desc}));t={id:c.j.data.id};LED('T-16 ticket "'+s+'" '+t.id);}return t.id;};
 const A=await mk('QA MAN merge A',L.D.MK,'Message in A');const B=await mk('QA MAN merge B',L.D.MK,'Message in B');const S=await mk('QA MAN merge Sales',L.D.MK,'Message in Sales ticket');
 if(fl((await api('GET','/modules/'+T+'/records/'+S)).j.data).department===L.D.MK){R.mvS=(await api('POST','/desk/tickets/'+S+'/move',{department_id:'ef8dc91f-1d30-491d-a1fc-9b62b96eca94',team_id:null,owner_id:null})).s;}
 require('fs').writeFileSync(OUT+'/t16.json',JSON.stringify({A,B,S}));
 const list=async()=>{await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/QA MAN merge A/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2500);};
 const sel=async n=>{await pg.locator('[aria-label="Select '+n+'"]').first().check({force:true}).catch(async()=>{await pg.locator('[aria-label="Select '+n+'"]').first().click({force:true});});await pg.waitForTimeout(600);};
 try{
 step='03';await list();await sel('QA MAN merge A');R.bar1=await pg.evaluate(()=>[...document.querySelectorAll('main button')].filter(b=>b.offsetParent).map(b=>(b.getAttribute('aria-label')||b.innerText).trim()).filter(t=>/merge|selected|close|assign|delete|more/i.test(t)).slice(0,12));
 const mb=pg.getByRole('button',{name:/^Merge/}).first();R.mergeOne={present:await mb.count(),disabled:await mb.isDisabled().catch(()=>null)};if(R.mergeOne.present&&!R.mergeOne.disabled){await mb.click();await pg.waitForTimeout(1500);R.mergeOne.msg=(await toast())||(await pg.locator('[role=dialog]').last().innerText().catch(()=>'')).slice(0,150);await pg.keyboard.press('Escape');}
 await L.shot('t16-03-one');
 step='01';await sel('QA MAN merge B');const mb2=pg.getByRole('button',{name:/^Merge/}).first();R.merge2={present:await mb2.count()};await mb2.click();await pg.waitForTimeout(2500);const d=pg.locator('[role=dialog]').last();R.dialog=(await d.innerText()).replace(/\s+/g,' ').slice(0,600);await L.shot('t16-01-dialog');
 const ra=d.locator('label,[role=radio],button').filter({hasText:'QA MAN merge A'}).first();if(await ra.count())await ra.click();await pg.waitForTimeout(600);
 const ok=d.getByRole('button',{name:/^(Merge|Merge tickets|Confirm)$/i}).last();await ok.click();R.mergeToast=await toast();await pg.waitForTimeout(3000);
 const a=fl((await api('GET','/modules/'+T+'/records/'+A)).j.data),b=await api('GET','/modules/'+T+'/records/'+B);R.after={A:a.status,B:b.s===200?fl(b.j.data).status:b.s,Bmerged:b.s===200?JSON.stringify(fl(b.j.data)).match(/merge[^,]{0,60}/i)?.[0]:null};
 await L.gotoTicket(A);const tab=pg.locator('[role=tab]').filter({hasText:/conversation/i}).first();const ctl=await tab.getAttribute('aria-controls');R.threadA=await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,500),ctl);R.mergedNote=(await L.body_txt()).match(/[^.]{0,60}merg[^.]{0,80}/i)?.[0];await L.shot('t16-01-A');
 step='02';await pg.getByRole('button',{name:'More ticket actions'}).first().click();await pg.waitForTimeout(1000);R.moreA=await pg.locator('[role=menuitem]').allInnerTexts();await pg.keyboard.press('Escape');
 R.unmergeBtns=await pg.evaluate(()=>[...document.querySelectorAll('main button,main a')].map(b=>(b.getAttribute('aria-label')||b.innerText).trim()).filter(t=>/unmerge|split|undo/i.test(t)));
 }catch(x){R.err=step+': '+String(x.message).slice(0,160);await L.shot('t16-err');}return R;};
