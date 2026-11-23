async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.mouse.click(1527,393);await page.waitForTimeout(1500);await page.mouse.click(1528,73);await page.waitForTimeout(3000);
await page.screenshot({path:R+'zd-az-4.png'});const t=await page.innerText('body');const m=[...t.matchAll(/.{0,80}(Preference|Threshold|Backlog|offline).{0,80}/gi)].map(x=>x[0]);return m.join('\n');}
