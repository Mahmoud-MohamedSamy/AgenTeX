async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(1005,364);await page.waitForTimeout(1000);await page.mouse.click(1285,204);await page.keyboard.type('QA RT20 AZ');await page.waitForTimeout(800);
await page.mouse.click(1100,323);await page.waitForTimeout(1500);/* sequential */
await page.mouse.click(900,518);await page.waitForTimeout(1500);await page.keyboard.type('test agent 1');await page.waitForTimeout(2500);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
