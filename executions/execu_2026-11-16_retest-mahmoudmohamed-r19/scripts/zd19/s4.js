async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const nx=async()=>{await page.locator('button:has-text("Next")').last().click();await page.waitForTimeout(12000);};
await nx();await page.screenshot({path:R+'zd-imp-c.png'});let t=await page.innerText('body');const a=t.slice(Math.max(0,t.indexOf('Review'))).slice(0,1200);
return a.replace(/[\w.+-]+@[\w.-]+/g,'<email>');}
