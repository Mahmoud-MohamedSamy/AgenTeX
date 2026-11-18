async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const ca=page.getByText('Clear All',{exact:true});if(await ca.count())await ca.first().click().catch(()=>{});await page.waitForTimeout(1000);
await page.mouse.click(667,299);await page.waitForTimeout(2500);
await page.locator('button',{hasText:/^Save$/}).first().click();
let t='';for(let k=0;k<30;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Start Import/.test(t)||/not present|error/i.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-m.png'});t=await page.innerText('body');
return t.slice(Math.max(0,t.indexOf('Review'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
