const RAW='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/evidence/raw/';
const o={};
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(12000);
await page.mouse.click(805,28);await page.waitForTimeout(6000);
o.url=page.url();await page.screenshot({path:RAW+'_probe-plus.png'});
o.body=(await page.innerText('body')).slice(0,900);
return o;
