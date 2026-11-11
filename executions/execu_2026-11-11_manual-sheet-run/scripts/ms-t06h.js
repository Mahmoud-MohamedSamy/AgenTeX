const L=require('./lib');module.exports=async()=>{await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/profile',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>/Landing page/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await pg.waitForTimeout(3000);
 const t=await L.body_txt();const heads=await pg.evaluate(()=>[...document.querySelectorAll('main h1,main h2,main h3,main [role=tab]')].map(h=>h.innerText.trim()));
 // settings search for signature
 await pg.goto(H+'/settings',{waitUntil:'commit'}).catch(()=>{});await pg.waitForTimeout(9000);const st=await L.body_txt();
 return {heads,sig:t.match(/.{0,80}[Ss]ignature.{0,80}/g),settingsSig:st.match(/.{0,60}[Ss]ignature.{0,60}/g)};};
