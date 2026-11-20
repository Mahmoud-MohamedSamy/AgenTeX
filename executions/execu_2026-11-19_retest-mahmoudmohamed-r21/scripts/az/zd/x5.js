async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
page.once('dialog',d=>d.accept().catch(()=>{}));await page.mouse.click(485,142);await page.waitForTimeout(2500);await page.screenshot({path:R+'zd-tmp.png'});return 'ok';}
