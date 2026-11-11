const L=require('./lib');module.exports=async()=>{const R={};const resp=[];pg.on('response',r=>{if(/signature/i.test(r.url())&&/api/.test(r.url()))resp.push(r.request().method()+' '+r.status()+' '+r.url().replace(H,''));});
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/settings',{waitUntil:'commit'}).catch(()=>{});await pg.waitForTimeout(8000);
 const s=pg.locator('input[placeholder="Search"]').first();if(await s.count()){await s.fill('signature');await pg.waitForTimeout(2500);R.hits=(await L.body_txt()).match(/.{0,40}[Ss]ignature.{0,60}/g);await L.shot('t06-05-settings-search');
  const hit=pg.locator('a,button').filter({hasText:/signature/i}).first();if(await hit.count()){await hit.click();await pg.waitForTimeout(6000);R.url=pg.url();R.page=(await L.body_txt()).replace(/^.*?CUSTOMIZATION/,'').slice(0,900);await L.shot('t06-05-company-sig');}}
 R.resp=resp;return R;};
