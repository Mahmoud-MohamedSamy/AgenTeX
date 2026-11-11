// T-10 explore: snippet API + composer Snippets panel and Save as snippet dialog.
const L=require('./lib');
module.exports=async()=>{const R={};let step='';
 for(const p of ['/desk/snippets','/desk/canned-responses','/mail/snippets','/desk/reply-snippets']){const r=await api('GET',p);R[p]=r.s+' '+r.t.slice(0,250);}
 let t=(await L.findTicket('QA MAN reply 01'))[0];if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN reply 01',department:L.D.MK,status:'Open',channel:'email',contact_id:'bc1b1c62-c31a-40ec-a089-cfcdcc6864b1',description:'Customer question (QA MAN).'}));t={id:c.j.data.id};LED('T-10 ticket "QA MAN reply 01" '+t.id);}
 require('fs').writeFileSync(OUT+'/t10.json',JSON.stringify({id:t.id}));
 try{step='open';await L.gotoTicket(t.id);await pg.getByRole('button',{name:/^Reply All$/}).first().click();await pg.waitForTimeout(4000);
 await pg.getByRole('button',{name:/^Snippets$/}).first().click();await pg.waitForTimeout(2500);R.panel=(await pg.evaluate(()=>{const p=document.querySelector('[role=dialog],[data-radix-popper-content-wrapper],[role=listbox]');return p?p.innerText.replace(/\s+/g,' ').slice(0,500):null;}));await L.shot('t10-0-snippets');
 R.panelCtl=await pg.evaluate(()=>{const p=document.querySelector('[role=dialog],[data-radix-popper-content-wrapper]');return p?[...p.querySelectorAll('button,input')].map(e=>(e.getAttribute('aria-label')||e.placeholder||e.innerText).trim().slice(0,30)).filter(Boolean):[];});await pg.keyboard.press('Escape');
 step='save';const ed=pg.locator('[contenteditable=true][aria-label="Reply body"]').last();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA MAN draft text');
 await pg.getByRole('button',{name:/^Save as snippet$/}).first().click();await pg.waitForTimeout(2500);const d=pg.locator('[role=dialog]').last();R.saveDialog=(await d.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500);R.saveCtl=await d.evaluate(x=>[...x.querySelectorAll('button,input,select,textarea,[contenteditable=true],[role=radio],[role=switch]')].map(e=>(e.getAttribute('aria-label')||e.placeholder||e.innerText||e.type).trim().slice(0,30))).catch(()=>[]);await L.shot('t10-0-savedialog');await pg.keyboard.press('Escape');
 }catch(x){R.err=step+': '+String(x.message).slice(0,140);await L.shot('t10-err');}return R;};
