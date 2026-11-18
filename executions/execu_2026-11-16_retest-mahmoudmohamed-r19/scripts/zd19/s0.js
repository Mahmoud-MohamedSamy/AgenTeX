async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.screenshot({path:R+'zd-imp-a.png'});const t=await page.innerText('body');return page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1500);}
