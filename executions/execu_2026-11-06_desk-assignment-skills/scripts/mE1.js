const o={};const KEY='fw1.a7a7a7a7000000000000000000000004.WhlDSFrXw45FcmzIBggO6JHvG4TMS5SgjIDyVn2O59I';
const ctx2=await page.context().browser().newContext({viewport:{width:900,height:900}});const p=await ctx2.newPage();
const net=[];p.on('response',r=>{if(/web-forms/.test(r.url()))net.push(r.status()+' '+r.request().method()+' '+r.url().replace(KEY,'<key>').slice(0,140));});
await p.goto('https://staging-crm.taviportal.com/embed/feedback/index.html?key='+encodeURIComponent(KEY)+'&mode=frame',{waitUntil:'commit',timeout:180000});
for(let i=0;i<30;i++){await p.waitForTimeout(2000);if(await p.locator('input').count())break;}
o.inputs=await p.$$eval('input,textarea,button',e=>e.map(x=>x.tagName+'|'+(x.name||'')+'|'+(x.type||'')+'|'+(x.getAttribute('aria-label')||'')+'|'+(x.id||'')+'|'+(x.innerText||'').slice(0,30)));
o.text=(await p.innerText('body').catch(()=>'')).slice(0,600);await p.screenshot({path:'../screenshots/ev-D14-webform-public.png'});o.net=net;await ctx2.close();return o;
