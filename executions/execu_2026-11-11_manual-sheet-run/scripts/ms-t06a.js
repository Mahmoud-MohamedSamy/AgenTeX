// T-06 prep: ticket "QA MAN reply 01" (Marketing, contact M1); explore reply menu + composer fields.
const L=require('./lib');
module.exports=async()=>{const R={};
 let t=(await L.findTicket('QA MAN reply 01'))[0];
 if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN reply 01',department:L.D.MK,status:'Open',channel:'email',contact_id:'bc1b1c62-c31a-40ec-a089-cfcdcc6864b1',description:'Customer question about a refund (QA MAN).'}));const id=c.j&&c.j.data&&c.j.data.id;R.create=c.s;if(id){LED('T-06 ticket "QA MAN reply 01" '+id);t={id};}}
 R.id=t.id;require('fs').writeFileSync(OUT+'/t06-id.json',JSON.stringify({id:t.id}));
 await L.gotoTicket(t.id);
 const more=pg.getByRole('button',{name:/other ways to reply|More reply/i}).first();R.more=await more.count();
 if(!R.more){R.btns=await pg.evaluate(()=>[...document.querySelectorAll('main button')].slice(0,30).map(b=>(b.getAttribute('aria-label')||b.innerText).trim().slice(0,30)));}
 else{await more.click();await pg.waitForTimeout(1200);R.menu=await pg.locator('[role=menuitem]').allInnerTexts();await L.shot('t06-0-replymenu');await pg.keyboard.press('Escape');}
 await pg.getByRole('button',{name:/^Reply( All)?$/}).first().click();await pg.waitForTimeout(4000);
 R.composer=(await L.body_txt()).match(/From .{0,400}/)?.[0];
 R.composerBtns=await pg.evaluate(()=>[...document.querySelectorAll('button')].map(b=>(b.getAttribute('aria-label')||b.innerText).trim().slice(0,25)).filter(Boolean).slice(-45));
 R.inputs=await pg.evaluate(()=>[...document.querySelectorAll('input,[contenteditable=true]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.tagName)+(e.isContentEditable?' (editable dir='+(e.getAttribute('dir')||getComputedStyle(e).direction)+')':'')));
 await L.shot('t06-0-composer');return R;};
