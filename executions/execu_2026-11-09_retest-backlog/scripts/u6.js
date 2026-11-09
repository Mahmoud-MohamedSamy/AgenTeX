const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});
await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded',timeout:120000});
const mb=page.getByRole('button',{name:'Open menu for Ticket',exact:true});await mb.waitFor({timeout:150000});await sleep(2000);await mb.click();await sleep(2000);
await page.getByText('Fields',{exact:true}).last().click({timeout:20000});await sleep(10000);
o.url=page.url();await page.screenshot({path:SS+'u6-fields.png'});
o.t=(await page.innerText('body')).split('Global Sets').pop().slice(0,1500);
return o;
