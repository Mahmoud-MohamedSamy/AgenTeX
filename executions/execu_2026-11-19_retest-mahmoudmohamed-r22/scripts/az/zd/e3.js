async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.screenshot({path:R+'zd-az-16-skill-target.png'});await page.mouse.click(730,846);await page.waitForTimeout(8000);await page.screenshot({path:R+'zd-az-17-skill-rule.png'});return 'ok';}
