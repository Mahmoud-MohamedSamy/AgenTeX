async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const l=page.locator('text=New Import');const bb=await l.last().boundingBox();await l.last().click();await page.waitForTimeout(12000);
await page.screenshot({path:R+'zd-imp-a.png'});const t=await page.innerText('body');return JSON.stringify(bb)+'\n'+t.slice(Math.max(0,t.indexOf('Data Administration'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
