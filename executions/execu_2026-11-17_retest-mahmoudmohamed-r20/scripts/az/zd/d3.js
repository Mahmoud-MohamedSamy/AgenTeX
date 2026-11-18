async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(605,225);await page.waitForTimeout(1500);await page.mouse.click(600,260);await page.keyboard.type('1');await page.waitForTimeout(1500);await page.mouse.click(460,292);await page.waitForTimeout(1200);
await page.screenshot({path:R+'zd-az-14-tech-prefs-test.png'});await page.mouse.click(455,740);await page.waitForTimeout(4000);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
