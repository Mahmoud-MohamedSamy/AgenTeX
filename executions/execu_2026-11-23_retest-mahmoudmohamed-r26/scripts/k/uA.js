const fs=require('fs');const X=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/3136b.json','utf8'));const R={};
await page.goto(H+'/views/all/tickets/'+X.t.A,{waitUntil:'domcontentloaded'});await page.getByText('#7225').first().waitFor({timeout:150000});await sleep(8000);
const sla=page.getByText('SLA',{exact:true}).first();await sla.scrollIntoViewIfNeeded().catch(()=>{});await sleep(1000);
R.sla=((await page.locator('body').innerText()).replace(/\s+/g,' ').match(/SLA .{0,120}/)||[])[0];await shot('3136-A-sla.png');return R;
