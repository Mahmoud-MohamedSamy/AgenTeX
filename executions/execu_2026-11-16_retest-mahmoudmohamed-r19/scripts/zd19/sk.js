const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';const ug=require('./ug.js');
module.exports=async(page)=>{const ok=await ug(page,process.env.TURL,/Ticket Properties/);await page.waitForTimeout(6000);
const l=page.getByText('Skills',{exact:true});await l.first().scrollIntoViewIfNeeded().catch(()=>{});const bb=await l.first().boundingBox();
await page.mouse.click(bb.x+20,bb.y+bb.height+14);await page.waitForTimeout(5000);{const xs=page.locator('xpath=//*[normalize-space(text())="Associate Skills"]');await xs.last().click({timeout:10000}).catch(()=>{});await page.waitForTimeout(4000);await xs.first().click({timeout:10000}).catch(()=>{});await page.waitForTimeout(6000);}await page.screenshot({path:R+process.env.SHOT+'.png'});
const t=await page.innerText('body');return 'ok='+ok+' bb='+JSON.stringify(bb)+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2500);};
