async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(437,319);await page.waitForTimeout(1500);
await page.mouse.click(705,612);await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-e.png'});
const t=await page.innerText('body');return t.slice(Math.max(0,t.indexOf('SAMPLE DATA'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2500);}
