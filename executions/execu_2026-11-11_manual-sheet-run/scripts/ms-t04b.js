const L=require('./lib');
module.exports=async()=>{const R={};await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});
 await pg.waitForFunction(()=>/Ticket|records/i.test(document.body.innerText)&&document.querySelectorAll('tr,[role=row]').length>3,null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(3000);
 R.buttons=await pg.evaluate(()=>[...document.querySelectorAll('button,a')].map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim().slice(0,30)).filter(t=>/new|create|add|\+/i.test(t)));
 await L.shot('t04-0-list');
 await L.gotoNew();R.url=pg.url();R.text=(await L.body_txt()).slice(0,2500);
 R.fields=await pg.evaluate(()=>[...document.querySelectorAll('label')].map(l=>l.innerText.trim()).filter(Boolean));
 R.btns=await pg.evaluate(()=>[...document.querySelectorAll('button')].map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim().slice(0,30)).filter(Boolean).slice(-30));
 await L.shot('t04-0-form');return R;};
