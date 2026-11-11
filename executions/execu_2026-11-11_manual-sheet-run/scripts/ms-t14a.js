// T-14 explore + run: Marketing ticket with owner + values; Move via More ticket actions / department chip; Sales; layout mapping to QA NDC Accounting; same dept; Arabic dialog.
const L=require('./lib');const SALES='SALES';
module.exports=async()=>{const R={};let step='';const toast=async()=>{let s='';for(let i=0;i<12&&!s;i++){await pg.waitForTimeout(400);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const mk=async s=>{let t=(await L.findTicket(s))[0];if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:s,department:L.D.MK,status:'Open',priority:'high',channel:'phone',description:'QA MAN move test'}));t={id:c.j.data.id};LED('T-14 ticket "'+s+'" '+t.id);}return t.id;};
 const rec=async id=>{const o=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);return {dept:o.department,owner:o.owner&&(o.owner.name||o.owner.id||o.owner),priority:o.priority,channel:o.channel,desc:o.description};};
 const deps=Object.fromEntries(arr((await api('GET','/desk/departments')).j.data).map(d=>[d.id,d.name]));
 try{
 step='open';const id=await mk('QA MAN move 01');R.before=await rec(id);await L.gotoTicket(id);
 await pg.getByRole('button',{name:'More ticket actions'}).first().click();await pg.waitForTimeout(1200);R.more=await pg.locator('[role=menuitem]').allInnerTexts();
 const mv=pg.getByRole('menuitem',{name:/^Move/i}).first();if(await mv.count())await mv.click();else{await pg.keyboard.press('Escape');await pg.getByRole('button',{name:/^Department:/}).first().click();}
 await pg.waitForTimeout(2500);const d=pg.locator('[role=dialog]').last();R.dialog=(await d.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,400);await L.shot('t14-01-dialog');
 R.dialogCtl=await d.evaluate(x=>[...x.querySelectorAll('button,select,input,[role=combobox]')].map(e=>(e.getAttribute('aria-label')||e.placeholder||e.innerText||e.tagName).trim().slice(0,30))).catch(()=>[]);
 step='opts';const db=d.locator('button[role=combobox],button[aria-haspopup],select').first();if(await db.count()){await db.click();await pg.waitForTimeout(1500);R.opts=(await pg.locator('[role=option]').allInnerTexts()).map(s=>s.trim());R.offersMarketing=R.opts.includes('Marketing');
  const so=pg.locator('[role=option]').filter({hasText:/^\s*Sales\s*$/}).first();if(await so.count())await so.click();await pg.waitForTimeout(2000);}
 R.dialog2=(await d.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500);await L.shot('t14-01-sales-picked');
 const ok=d.getByRole('button',{name:/^(Move|Move ticket|Confirm|Save)$/i}).last();if(await ok.count()){await ok.click();R.moveToast=await toast();await pg.waitForTimeout(3000);}
 R.after=await rec(id);R.afterDept=deps[R.after.dept];R.ownerNote=(await L.body_txt()).match(/[^.]{0,80}(owner|unassigned)[^.]{0,80}/i)?.[0];await L.shot('t14-01-moved');
 const ht=pg.locator('[role=tab]').filter({hasText:/history/i}).first();await ht.click();await pg.waitForTimeout(4000);const ctl=await ht.getAttribute('aria-controls');R.hist=await pg.evaluate(c=>document.getElementById(c).innerText.replace(/\s+/g,' ').slice(0,400),ctl);
 }catch(x){R.err=step+': '+String(x.message).slice(0,160);await L.shot('t14-err');}return R;};
