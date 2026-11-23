async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(1174,23);await page.waitForTimeout(1500);
await page.mouse.click(528,73);await page.waitForTimeout(2000);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
