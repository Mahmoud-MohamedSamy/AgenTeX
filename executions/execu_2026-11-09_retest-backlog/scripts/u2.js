const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
await page.goto(H+'/settings',{waitUntil:'domcontentloaded',timeout:120000});await sleep(12000);
await page.getByText('Modules and Fields',{exact:true}).first().click();await sleep(8000);
const u1=page.url();
await page.getByText(/^Tickets?$/).last().click().catch(e=>{});await sleep(8000);
await page.screenshot({path:SS+'u2-tickets-module.png'});
return {u1,url:page.url(),t:(await page.innerText('main').catch(()=>page.innerText('body'))).slice(0,1800)};
