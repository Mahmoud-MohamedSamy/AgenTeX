async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.screenshot({path:R+'ZD-3-5.png'});
await page.getByText('1499272000000485053').first().click();
let t='';for(let k=0;k<20;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Added|Created|Failed|Skipped|Records/i.test(t))break;}
await page.waitForTimeout(4000);await page.screenshot({path:R+'ZD-3-6.png'});t=await page.innerText('body');
return t.slice(Math.max(0,t.indexOf('Data Administration'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2500);}
