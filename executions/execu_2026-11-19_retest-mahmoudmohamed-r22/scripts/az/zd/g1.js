async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/automation/assignmentrules',{waitUntil:'commit',timeout:90000});
for(let k=0;k<60;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(/Round Robin/i.test(t)&&t.length>500)break;}
await page.waitForTimeout(4000);await page.screenshot({path:R+'zd-az-1.png'});return page.url()+'\n'+(await page.innerText('body')).slice(0,3000);}
