async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.locator('button',{hasText:/^Save$/}).first().click();await page.waitForTimeout(6000);
let t=await page.innerText('body');if(/not present|missing/.test(t))return 'save err '+t.slice(t.indexOf('SaveCancel')).slice(0,300);
await page.locator('button',{hasText:/^Next$/}).last().click();
for(let k=0;k<30;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Start Import|missing|not present/.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-v.png'});t=await page.innerText('body');
return t.slice(Math.max(0,t.indexOf('Review'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
