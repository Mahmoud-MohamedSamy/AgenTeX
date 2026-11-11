const L=require('./lib');module.exports=async()=>{const R={};await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/profile',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Landing page/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(2000);
 const resp=[];pg.on('response',r=>{if(/signature/i.test(r.url()))resp.push(r.request().method()+' '+r.status()+' '+r.url().replace(H,''));});
 await pg.getByRole('tab',{name:/Signatures/i}).click();await pg.waitForTimeout(4000);R.resp=resp;
 R.panel=await pg.evaluate(()=>{const p=document.querySelector('[role=tabpanel]:not([hidden])');return p?p.innerText.replace(/\s+/g,' ').slice(0,900):null;});
 R.btns=await pg.evaluate(()=>{const p=document.querySelector('[role=tabpanel]:not([hidden])');return p?[...p.querySelectorAll('button')].map(b=>(b.getAttribute('aria-label')||b.innerText).trim().slice(0,30)):[];});
 await L.shot('t06-05-signatures');return R;};
