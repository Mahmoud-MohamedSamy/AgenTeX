async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(450,182);await page.keyboard.type('QA RT20 AZ RR');await page.waitForTimeout(500);
await page.mouse.click(328,842);await page.waitForTimeout(6000);
await page.screenshot({path:R+'zd-az-6.png'});const t=await page.innerText('body');return t.slice(t.indexOf('New Round Robin')).slice(0,3000);}
