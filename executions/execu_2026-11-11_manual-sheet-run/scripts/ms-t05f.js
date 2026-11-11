// T-05-06 on a Customer Support ticket: Agent C sets Medium, then Owner (page opened before) sets Low without reload.
const L=require('./lib');const path=require('path');
module.exports=async()=>{const R={};
 let t=(await L.findTicket('QA MAN two editors'))[0];if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN two editors',department:L.D.CS,status:'Open'}));t={id:c.j.data.id};LED('T-05-06 ticket "QA MAN two editors" '+t.id);}
 R.mv=(await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:'9d182dfa-05f3-4af7-9685-8615a2fbe537',team_id:null})).s;const id=t.id;const toast=async p=>{let s='';for(let i=0;i<12&&!s;i++){await p.waitForTimeout(400);s=await p.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=status],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const setPri=async(p,val)=>{await p.getByRole('button',{name:'Edit Priority'}).click();await p.waitForTimeout(1200);const ps=p.locator('[data-rule-field="priority"] button[role=combobox], [data-rule-field="priority"] button[aria-haspopup]').first();if(await ps.count())await ps.click();else await p.getByText(/^(Select|Low|Medium|High)$/).last().click();await p.waitForTimeout(1000);
  await p.locator('[role=option]').filter({hasText:new RegExp('^\s*'+val+'\s*$')}).first().click().catch(()=>{});await p.waitForTimeout(500);await p.getByRole('button',{name:/^Save$/}).last().click();return toast(p);};
 await L.gotoTicket(id);
 const ctxB=await pg.context().browser().newContext({storageState:path.join(OUT,'agentc.json')});const pB=await ctxB.newPage();await pB.setViewportSize({width:1600,height:1000});
 await pB.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'}).catch(()=>{});await pB.waitForFunction(()=>/Ticket Owner|not available/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pB.waitForTimeout(4000);
 R.bOpen=!/not available/.test(await pB.innerText('body'));
 if(R.bOpen){R.bToast=await setPri(pB,'Medium');await pB.waitForTimeout(3000);R.afterB=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data).priority;
  R.ownerScreen=(await L.body_txt()).match(/Priority (-None-|Low|Medium|High|Select)/)?.[0];
  R.oToast=await setPri(pg,'Low');await pg.waitForTimeout(3000);await L.shot('t05-06-owner-second');R.final=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data).priority;
  const ht=pg.locator('[role=tab]').filter({hasText:/history/i}).first();await ht.click();await pg.waitForTimeout(4000);const ctl=await ht.getAttribute('aria-controls');R.hist=await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,500),ctl);await L.shot('t05-06-history');}
 await pB.screenshot({path:path.join(OUT,'../screenshots/raw/t05-06-agentc.png')});await ctxB.storageState({path:path.join(OUT,'agentc.json')}).catch(()=>{});await ctxB.close();return R;};
