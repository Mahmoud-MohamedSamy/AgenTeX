async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.locator('button',{hasText:/^Next$/}).last().click();
let t='';for(let k=0;k<30;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Start Import/.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-q.png'});t=await page.innerText('body');
return t.slice(Math.max(0,t.indexOf('Review'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
