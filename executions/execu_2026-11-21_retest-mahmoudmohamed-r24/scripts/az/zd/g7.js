async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(833,203);await page.waitForTimeout(1500);await page.keyboard.type('Subject');await page.waitForTimeout(1500);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
