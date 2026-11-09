const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
await page.goto(H+'/settings',{waitUntil:'domcontentloaded',timeout:120000});await sleep(15000);
await page.screenshot({path:SS+'u1-settings.png'});
const t=(await page.innerText('body')).slice(0,1500);
const scripts=await page.$$eval('script[src]',s=>s.map(x=>x.src));
return {url:page.url(),t,scripts};
