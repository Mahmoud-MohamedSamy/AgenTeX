async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(644,402);await page.waitForTimeout(4000);await page.screenshot({path:R+'zd-az-20-tech-rules-after.png'});
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/automation/1499272000000006907/autoassignment',{waitUntil:'commit'});
for(let k=0;k<40;k++){await page.waitForTimeout(2000);if(/QA RT20 AZ RR/.test(await page.innerText('body').catch(()=>'')))break;}await page.waitForTimeout(3000);
await page.mouse.move(800,143);await page.waitForTimeout(1500);await page.mouse.click(450,142);await page.waitForTimeout(2500);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
