const fs=require('fs');const X=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/3136b.json','utf8'));
await page.goto(H+'/views/all/tickets/'+X.t.A,{waitUntil:'domcontentloaded'});await page.getByText('#7225').first().waitFor({timeout:150000});await sleep(8000);
const el=page.getByText('No SLA applies to this ticket.').first();await el.scrollIntoViewIfNeeded();await sleep(1500);const bb=await el.boundingBox();await shot('3136-A-sla2.png');return {bb};
