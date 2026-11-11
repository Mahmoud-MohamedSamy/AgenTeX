// T-13-07 Agent C closes and reopens his own Customer Support ticket (blueprint Tickets from Mail applies there).
const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t13-agent.json')).id;
 const toast=async()=>{let s='';for(let i=0;i<12&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const st=async()=>fl((await api('GET','/modules/'+T+'/records/'+id)).j.data).status;
 await L.gotoTicket(id);R.page=(await L.body_txt()).match(/(Steps|blueprint).{0,160}/)?.[0];R.btns=await pg.evaluate(()=>[...document.querySelectorAll('main button')].filter(b=>b.offsetParent).map(b=>(b.getAttribute('aria-label')||b.innerText).trim().slice(0,30)).filter(t=>/close|reopen|closed|on hold/i.test(t)));
 const c1=pg.getByRole('button',{name:/^Close Ticket$/}).first();const c2=pg.getByRole('button',{name:/^Close ticket$/}).last();
 const c=(await c1.count())?c1:c2;R.closeEnabled=!(await c.isDisabled().catch(()=>true));
 if(R.closeEnabled){await c.click();await pg.waitForTimeout(2000);const d=pg.locator('[role=dialog],[role=alertdialog]').last();if(await d.count()&&await d.isVisible()){R.dialog=(await d.innerText()).replace(/\s+/g,' ').slice(0,300);const ok=d.getByRole('button',{name:/^(Close|Close ticket|Save|Done|Confirm)/i}).last();if(await ok.count())await ok.click();}R.closeToast=await toast();await pg.waitForTimeout(2500);}
 R.afterClose=await st();await L.shot('t13-07-agent-closed');
 const ro=pg.getByRole('button',{name:/^Reopen/i}).first();R.reopenBtn=await ro.count();if(R.reopenBtn){await ro.click();await pg.waitForTimeout(1500);const d=pg.locator('[role=dialog],[role=alertdialog]').last();if(await d.count()&&await d.isVisible()){R.reDialog=(await d.innerText()).replace(/\s+/g,' ').slice(0,200);await d.getByRole('button',{name:/^Reopen/i}).last().click().catch(()=>{});}R.reopenToast=await toast();await pg.waitForTimeout(2000);}
 R.afterReopen=await st();await L.shot('t13-07-agent-reopened');return R;};
