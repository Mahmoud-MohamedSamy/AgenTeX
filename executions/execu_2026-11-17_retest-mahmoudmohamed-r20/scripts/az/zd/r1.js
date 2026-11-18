async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(1403,73);await page.waitForTimeout(7000);await page.mouse.click(450,182);await page.keyboard.type('QA RT20 AZ RR Tech');await page.waitForTimeout(500);
await page.mouse.click(328,842);await page.waitForTimeout(8000);
await page.mouse.click(833,203);await page.waitForTimeout(1500);await page.keyboard.type('Subject');await page.waitForTimeout(1500);await page.mouse.click(758,330);await page.waitForTimeout(1500);
await page.mouse.click(1045,203);await page.waitForTimeout(1500);await page.mouse.click(1005,364);await page.waitForTimeout(1000);await page.mouse.click(1285,204);await page.keyboard.type('QA RT20 AZ');await page.waitForTimeout(800);
await page.mouse.click(1100,323);await page.waitForTimeout(1500);await page.mouse.click(900,518);await page.waitForTimeout(1500);await page.keyboard.type('mahmoud');await page.waitForTimeout(3000);
await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
