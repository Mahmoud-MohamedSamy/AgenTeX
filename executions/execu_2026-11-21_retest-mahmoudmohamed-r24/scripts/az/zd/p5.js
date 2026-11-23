async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(1528,73);await page.waitForTimeout(3000);
await page.mouse.click(654,76);await page.waitForTimeout(1000);await page.mouse.click(605,225);await page.waitForTimeout(1500);await page.mouse.click(600,260);await page.keyboard.type('40');await page.waitForTimeout(1500);
await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
