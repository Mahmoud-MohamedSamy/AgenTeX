async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
for(let k=0;k<40;k++){const t=await page.innerText('body');if(!/Please wait until/.test(t)&&/FIELDS IN FILE|Import Action/i.test(t))break;await page.waitForTimeout(3000);}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-d.png'});const t=await page.innerText('body');return t.slice(Math.max(0,t.indexOf('Upload Files'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2500);}
