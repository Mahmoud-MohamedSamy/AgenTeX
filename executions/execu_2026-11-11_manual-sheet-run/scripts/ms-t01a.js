// T-01 seed 5 Marketing tickets; T-01-01 system views (count vs rows, row statuses); explore Add Custom View form.
const L=require('./lib');
module.exports=async()=>{const R={};let step='';
 const seed=[['QA MAN view A','Open','low'],['QA MAN view B','On Hold','medium'],['QA MAN view C','Open','high'],['QA MAN view D','Closed','urgent'],['QA MAN view E','Open',null]];
 for(const [s,st,p] of seed){if((await L.findTicket(s))[0])continue;const v={subject:s,department:L.D.MK,status:st};if(p)v.priority=p;const c=await api('POST','/modules/'+T+'/records',L.body(v));LED('T-01 ticket "'+s+'" '+(c.j&&c.j.data&&c.j.data.id));await W(1500);}
 try{
 step='01';await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/ALL VIEWS/i.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(3000);
 R.sidebar=await pg.evaluate(()=>[...document.querySelectorAll('nav a, aside a')].map(a=>a.innerText.replace(/\s+/g,' ').trim()).filter(t=>/\d+$/.test(t)).slice(0,20));
 R.views={};for(const v of ['On Hold','Closed','Unassigned Open Tickets','My Open Tickets']){const a=pg.locator('nav a, aside a').filter({hasText:new RegExp('^'+v)}).first();if(!(await a.count()))continue;await a.click();await pg.waitForTimeout(7000);
  const head=(await L.body_txt()).match(new RegExp(v+' \\((\\d+)\\)'))?.[1];const statuses=await pg.evaluate(()=>[...document.querySelectorAll('main button')].map(b=>(b.getAttribute('aria-label')||'')).filter(t=>/^Status:/.test(t)).map(t=>t.replace('Status: ','')));
  const owners=await pg.evaluate(()=>[...document.querySelectorAll('main [title]')].map(e=>e.getAttribute('title')).filter(t=>/owner|Unassigned/i.test(t)).slice(0,5));
  R.views[v]={head,rows:statuses.length,distinct:[...new Set(statuses)],owners};await L.shot('t01-01-'+v.replace(/\W+/g,''));}
 step='02';const add=pg.getByRole('button',{name:'Add Custom View'}).first();await add.click();await pg.waitForTimeout(4000);R.addUrl=pg.url();R.addForm=(await L.body_txt()).replace(/^.*?Scheduled Replies/,'').slice(0,900);
 R.addInputs=await pg.evaluate(()=>[...document.querySelectorAll('main input,main select,main button,main [role=combobox]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.innerText||e.tagName).trim().slice(0,30)).filter(Boolean).slice(0,40));await L.shot('t01-02-addform');
 }catch(x){R.err=step+': '+String(x.message).slice(0,140);await L.shot('t01-err');}return R;};
