const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
await page.setViewportSize({width:1600,height:900});
await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded',timeout:120000});await sleep(60000);
await page.screenshot({path:SS+'u41-new.png'});return {url:page.url(),t:(await page.innerText('body')).slice(-1500)};
