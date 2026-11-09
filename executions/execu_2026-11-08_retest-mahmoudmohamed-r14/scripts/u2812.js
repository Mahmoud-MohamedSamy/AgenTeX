const fs=require('fs');const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-08_retest-mahmoudmohamed-r14';
const L=fs.readFileSync(RUN+'/ledger.md','utf8').split('\n').find(l=>l.includes('"QA RT14 2812 SLA off"'));const id=L.match(/[0-9a-f]{8}-[0-9a-f-]{27}/)[0];
await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:120000});await page.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await page.waitForTimeout(3000);
const h=page.getByRole('tab',{name:/History/i});if(await h.count()){await h.first().click();await page.waitForTimeout(4000);}
await page.screenshot({path:RUN+'/screenshots/raw/2812-sla-history-off.png'});
return {id,text:(await page.innerText('main')).replace(/\s+/g,' ').match(/.{0,300}Team Assignment is off.{0,300}/)?.[0]||(await page.innerText('main')).replace(/\s+/g,' ').slice(0,800)};
