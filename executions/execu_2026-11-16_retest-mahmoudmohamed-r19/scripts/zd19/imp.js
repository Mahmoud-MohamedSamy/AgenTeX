const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';const ug=require('./ug.js');
module.exports=async(page)=>{const ok=await ug(page,'https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/automation/directassignment',/DATA ADMINISTRATION|Data Administration/);
const l=page.getByText('Import',{exact:true});await l.first().waitFor({timeout:60000}).catch(()=>{});const n=await l.count();if(n){await l.first().click();}
for(let k=0;k<40;k++){await page.waitForTimeout(2000);if(/New Import|Import History|Start Import/i.test(await page.innerText('body')))break;}await page.waitForTimeout(4000);
await page.screenshot({path:R+'ZD-3-1.png'});const t=await page.innerText('body');const i=t.indexOf('Workstation');return 'ok='+ok+' n='+n+' '+page.url()+'\n'+t.slice(i).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2500);};
