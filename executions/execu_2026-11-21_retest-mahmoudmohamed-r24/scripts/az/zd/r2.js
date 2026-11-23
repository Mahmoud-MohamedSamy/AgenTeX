async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(840,570);await page.waitForTimeout(1500);await page.mouse.click(730,846);await page.waitForTimeout(9000);await page.screenshot({path:R+'zd-az-15-tech-rule.png'});return 'ok';}
