// Explore inline edit controls: subject title, Due Date, Priority.
const L=require('./lib');
module.exports=async()=>{const R={};const id=JSON.parse(require('fs').readFileSync(OUT+'/ms-t05a.json')).id;await L.gotoTicket(id);
 const dump=async()=>pg.evaluate(()=>{const a=document.activeElement;const pop=document.querySelector('[role=dialog],[role=listbox],[data-radix-popper-content-wrapper]');return {active:a?a.tagName+' '+(a.getAttribute('type')||'')+' '+(a.getAttribute('aria-label')||'')+' val='+(a.value||'').slice(0,40):'',pop:pop?pop.innerText.replace(/\s+/g,' ').slice(0,300):null};});
 const ep=pg.getByRole('button',{name:'Edit Priority'});R.ep=await ep.count();if(R.ep){await ep.click();await pg.waitForTimeout(1500);R.afterEP=await dump();await L.shot('t05-02-edit-priority');await pg.keyboard.press('Escape');await pg.waitForTimeout(800);}
 const dd=pg.getByText('Due Date',{exact:true}).first();R.dd=await dd.count();if(R.dd){const box=dd.locator('xpath=..');await box.click();await pg.waitForTimeout(1500);R.afterDD=await dump();R.ddHtml=await box.evaluate(e=>e.outerHTML.replace(/class="[^"]*"/g,'').replace(/<svg.*?<\/svg>/g,'').slice(0,800));await L.shot('t05-02-edit-due');await pg.keyboard.press('Escape');await pg.waitForTimeout(800);}
 const h=pg.locator('h1,h2').filter({hasText:'QA MAN phone 01'}).first();R.h=await h.count();if(R.h){R.hHtml=await h.evaluate(e=>e.outerHTML.replace(/class="[^"]*"/g,'').slice(0,300));await h.click();await pg.waitForTimeout(1200);R.afterH=await dump();await L.shot('t05-02-edit-subject');await pg.keyboard.press('Escape');}
 R.allFieldsBtns=await pg.evaluate(()=>[...document.querySelectorAll('button[aria-label^="Edit "]')].map(b=>b.getAttribute('aria-label')));
 return R;};
