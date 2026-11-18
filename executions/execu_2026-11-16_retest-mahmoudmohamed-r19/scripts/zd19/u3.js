async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const c=page.getByText('Contracts',{exact:true});await c.first().click().catch(()=>{});
let t='';for(let k=0;k<40;k++){await page.waitForTimeout(2000);t=await page.innerText('body');if(/New Contract|Add Contract|No contracts|Contract Name/i.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-c-1.png'});return page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1200);}
