async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(644,402);await page.waitForTimeout(4000);await page.screenshot({path:R+'zd-az-21-tes-rules-after.png'});return (await page.innerText('body')).includes('QA RT20 AZ')?'still there':'gone';}
