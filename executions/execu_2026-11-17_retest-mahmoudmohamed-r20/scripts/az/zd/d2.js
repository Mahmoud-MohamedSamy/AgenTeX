async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(494,166);await page.waitForTimeout(6000);await page.screenshot({path:R+'zd-az-12-tech-list.png'});
await page.mouse.click(1528,73);await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-az-13-tech-prefs-orig.png'});return 'ok';}
