const id=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/hx/id.json','utf8')).id;
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'domcontentloaded'});await sleep(6000);
const tab=page.getByRole('tab',{name:/History/i}).or(page.getByText(/^History$/)).first();await tab.click().catch(e=>log('no tab '+e.message.slice(0,80)));await sleep(4000);
await shot('3068-r2-history.png',{fullPage:false});
const t=await text();const i=t.indexOf('Closed Time');log('closed idx',i);log(t.slice(Math.max(0,i-400),i+400).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g,'<email>'));
