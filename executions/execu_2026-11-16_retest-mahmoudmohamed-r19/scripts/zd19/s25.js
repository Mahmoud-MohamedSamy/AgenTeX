async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(84,837);const t0=new Date().toISOString();
let t='';for(let k=0;k<40;k++){await page.waitForTimeout(4000);t=await page.innerText('body');if(/Completed|Success|Failed|Skipped|Partial/i.test(t))break;}
await page.waitForTimeout(4000);await page.screenshot({path:R+'zd-imp-w.png'});t=await page.innerText('body');
return t0+'\n'+t.slice(Math.max(0,t.indexOf('Data Administration'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2500);}
