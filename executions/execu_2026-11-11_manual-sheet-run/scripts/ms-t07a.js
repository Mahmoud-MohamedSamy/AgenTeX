// T-07 prep + explore: CS ticket owned by Agent C; open Comment editor; add a private comment; read its action menu.
const L=require('./lib');
module.exports=async()=>{const R={};
 let t=(await L.findTicket('QA MAN comment 01'))[0];
 if(!t){const c=await api('POST','/modules/'+T+'/records',L.body({subject:'QA MAN comment 01',department:L.D.CS,status:'Open',channel:'email',contact_id:'bc1b1c62-c31a-40ec-a089-cfcdcc6864b1',description:'Customer asks about a booking (QA MAN).'}));t={id:c.j.data.id};LED('T-07 ticket "QA MAN comment 01" '+t.id);
  R.assign=(await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:'9d182dfa-05f3-4af7-9685-8615a2fbe537',team_id:null})).s;}
 R.id=t.id;require('fs').writeFileSync(OUT+'/t07-id.json',JSON.stringify({id:t.id}));
 await L.gotoTicket(t.id);await pg.getByRole('button',{name:/^Comment/}).first().click();await pg.waitForTimeout(3000);
 R.editor=(await L.body_txt()).match(/.{0,200}(Private|Public|Visibility).{0,200}/)?.[0];
 R.btns=await pg.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>(b.getAttribute('aria-label')||b.innerText).trim().slice(0,30)).filter(Boolean).slice(-25));
 R.editables=await pg.evaluate(()=>[...document.querySelectorAll('[contenteditable=true],textarea')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.tagName)+' text='+e.innerText.slice(0,40)));
 await L.shot('t07-0-comment-editor');return R;};
