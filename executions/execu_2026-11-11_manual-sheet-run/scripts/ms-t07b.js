const L=require('./lib');module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/t07-id.json')).id;await L.gotoTicket(id);
 await pg.waitForFunction(()=>/Customer asks about a booking|No conversation|Nothing sent yet/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(1500);
 await pg.getByRole('button',{name:'Comment (Shift + C)'}).click();await pg.waitForTimeout(3500);
 R.editables=await pg.evaluate(()=>[...document.querySelectorAll('[contenteditable=true],textarea')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.tagName)+' text='+e.innerText.slice(0,40)));
 R.area=(await L.body_txt()).match(/.{0,100}(Private|Public|visib).{0,250}/i)?.[0];
 R.btns=await pg.evaluate(()=>[...document.querySelectorAll('button,select,[role=combobox]')].filter(b=>b.offsetParent).map(b=>(b.getAttribute('aria-label')||b.innerText).trim().replace(/\s+/g,' ').slice(0,30)).filter(Boolean).slice(-22));
 await L.shot('t07-0-comment-editor');return R;};
