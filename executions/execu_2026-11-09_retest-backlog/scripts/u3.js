const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});
await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('Ticket Status',{exact:true}).last().waitFor({timeout:120000});await sleep(2000);
await page.getByText('Ticket Status',{exact:true}).last().click();await sleep(4000);
await page.getByText(/department/i).first().waitFor({timeout:60000}).catch(()=>{});await sleep(3000);
await page.screenshot({path:SS+'2174-10-ticket-status.png'});o.url=page.url();
o.dept=(await page.innerText('body')).match(/[^\n]*(department|per dep)[^\n]*/gi);
return o;
