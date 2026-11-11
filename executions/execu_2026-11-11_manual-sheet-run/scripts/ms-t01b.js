// T-01-01 counts vs API; open the custom view editor from the Views "+" button.
const L=require('./lib');
module.exports=async()=>{const R={};const all=[];for(let p=1;p<10;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const l=arr(r.j&&r.j.data).map(fl);all.push(...l);if(l.length<100)break;}
 const me='97be04b6-0a08-4883-aa51-e1650b11cab7';const own=o=>o.owner&&(o.owner.id||o.owner);
 R.api={all:all.length,onHold:all.filter(o=>o.status==='On Hold').length,closed:all.filter(o=>o.status==='Closed').length,open:all.filter(o=>o.status==='Open').length,unassignedOpen:all.filter(o=>!own(o)&&o.status==='Open').length,myOpen:all.filter(o=>own(o)===me&&o.status==='Open').length,mine:all.filter(o=>own(o)===me).length};
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/ALL VIEWS/i.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2000);
 R.sidebar=await pg.evaluate(()=>[...document.querySelectorAll('nav a, aside a')].map(a=>a.innerText.replace(/\s+/g,' ').trim()).filter(t=>/^(All Tickets|My Tickets|My Open Tickets|Unassigned Open Tickets|Open|On Hold|Closed) \d+$/.test(t)));
 const plus=pg.locator('aside button, nav button').filter({has:pg.locator('svg')}).filter({hasNotText:/./});R.plusBtns=await pg.evaluate(()=>[...document.querySelectorAll('aside button, nav button')].map(b=>b.getAttribute('aria-label')||b.title||'').filter(Boolean));
 const add=pg.locator('aside button[aria-label*="view" i], nav button[aria-label*="view" i]').filter({hasText:''});
 const cand=pg.getByRole('button',{name:/^(Add Custom View|New view|Create view|Add view)$/i});R.cand=await cand.count();
 for(let i=0;i<R.cand;i++){const b=cand.nth(i);if(await b.isVisible()){await b.click();break;}}await pg.waitForTimeout(5000);
 R.url=pg.url();R.form=(await L.body_txt()).replace(/^.*?Scheduled Replies/,'').slice(0,800);R.inputs=await pg.evaluate(()=>[...document.querySelectorAll('[role=dialog] input,[role=dialog] button,[role=dialog] select, main input, main select')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.innerText||e.name||e.tagName).trim().slice(0,30)).filter(Boolean).slice(0,40));
 await L.shot('t01-02-addform');return R;};
