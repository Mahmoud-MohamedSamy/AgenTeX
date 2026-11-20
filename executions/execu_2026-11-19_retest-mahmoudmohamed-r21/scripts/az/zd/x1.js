async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/automation/1499272000000432293/autoassignment',{waitUntil:'commit'});
for(let k=0;k<40;k++){await page.waitForTimeout(2000);if(/QA RT20 AZ RR Tech/.test(await page.innerText('body').catch(()=>'')))break;}await page.waitForTimeout(3000);
await page.mouse.click(1528,73);await page.waitForTimeout(3000);
await page.mouse.click(605,225);await page.waitForTimeout(1500);await page.mouse.click(600,260);await page.keyboard.type('40');await page.waitForTimeout(1500);await page.mouse.click(465,302);await page.waitForTimeout(1200);
await page.mouse.click(605,600);await page.waitForTimeout(1500);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
