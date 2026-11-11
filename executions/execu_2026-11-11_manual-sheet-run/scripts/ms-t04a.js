// Explore the Create Ticket form (read-only, no save).
const L=require('./lib');
module.exports=async()=>{const R={};await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>document.body.innerText.length>300,null,{timeout:90000}).catch(()=>{});await pg.waitForTimeout(4000);R.html=await pg.evaluate(()=>[...document.querySelectorAll('button')].slice(0,40).map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim().slice(0,30)).filter(Boolean));
 R.header=await pg.evaluate(()=>[...document.querySelectorAll('header button,header a,[role=banner] button')].map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim()).filter(Boolean).slice(0,30));
 await L.shot('t04-0-list');
 const plus=pg.locator('header button[aria-label*="reate" i], header button[aria-label*="New" i], header button[aria-label*="Add" i]').first();R.plus=await plus.count();
 if(R.plus){await plus.click();await pg.waitForTimeout(2000);R.menu=(await L.body_txt()).match(/(Ticket|Contact|Account|Task|Call|Event)[^]{0,0}/g);await L.shot('t04-0-plusmenu');
  const mi=pg.getByRole('menuitem',{name:/^Ticket$/}).first();R.mi=await mi.count();if(R.mi){await mi.click();await pg.waitForTimeout(8000);}}
 R.url=pg.url();R.text=(await L.body_txt()).slice(0,1500);
 R.fields=await pg.evaluate(()=>[...document.querySelectorAll('label')].map(l=>{const f=l.htmlFor&&document.getElementById(l.htmlFor);return l.innerText.trim()+(f?' ['+f.tagName+(f.type?':'+f.type:'')+']':'');}).filter(Boolean).slice(0,60));
 await L.shot('t04-0-form');return R;};
