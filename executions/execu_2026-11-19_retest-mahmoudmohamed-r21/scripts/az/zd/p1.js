async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(70,568);await page.waitForTimeout(7000);await page.screenshot({path:R+'zd-az-9-list.png'});
await page.mouse.click(1528,73);await page.waitForTimeout(2500);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
