const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});const writes=[];
page.on('request',r=>{if(/api\/v1/.test(r.url())&&!['GET','OPTIONS'].includes(r.method())&&!/heartbeat|resolved-batch|iam\/auth|realtime|query|search/.test(r.url()))writes.push(r.method()+' '+r.url().replace(/.*api\/v1/,''));});
await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded',timeout:120000});await sleep(15000);
o.plusBtns=await page.$$eval('button',b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText||'').trim()).filter(t=>/create|new|add|^\+$/i.test(t)).slice(0,10));
const plus=page.getByRole('button',{name:/^(Create|New ticket|Create ticket|Add ticket)$/i}).first();
if(await plus.count()){await plus.click();await sleep(6000);}else{await page.getByRole('button',{name:'Create in another module'}).click();await sleep(2000);o.menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).split('\n');await page.getByRole('menuitem',{name:/^Ticket$/}).first().click().catch(e=>o.e=e.message.slice(0,90));await sleep(6000);}
o.url=page.url();await page.screenshot({path:SS+'u40-new.png'});
o.formText=(await page.innerText('body')).match(/[^\n]*(Department|Status)[^\n]*/g);
return {o,writes};
