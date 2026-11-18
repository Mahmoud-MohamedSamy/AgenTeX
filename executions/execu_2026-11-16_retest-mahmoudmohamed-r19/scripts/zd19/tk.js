const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';const ug=require('./ug.js');
module.exports=async(page)=>{const ok=await ug(page,process.env.TURL,/HISTORY|History|Ticket Properties/);
if(process.env.TAB){const t=page.getByText(new RegExp('^'+process.env.TAB+'$','i'));if(await t.count()){await t.first().click();await page.waitForTimeout(8000);}}
await page.screenshot({path:R+process.env.SHOT+'.png'});return 'ok='+ok+'\n'+(await page.innerText('body')).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,3000);};
