const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
module.exports=async(page)=>{await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/automation/directassignment',{waitUntil:'domcontentloaded'});await page.waitForTimeout(15000);
const t=await page.innerText('body');await page.screenshot({path:R+'zd-tmp-u1.png'});return page.url()+'\n'+t.slice(0,2500);};
