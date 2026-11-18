async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(654,76);await page.waitForTimeout(1000);await page.mouse.click(605,225);await page.waitForTimeout(2000);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
