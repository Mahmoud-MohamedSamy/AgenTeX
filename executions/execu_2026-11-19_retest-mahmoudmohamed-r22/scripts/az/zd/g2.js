async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});
await page.getByText('Assignment Rules',{exact:true}).first().click();await page.waitForTimeout(8000);
const t1=await page.innerText('body');const i=t1.indexOf('Need Help');await page.screenshot({path:R+'zd-az-2.png'});
const rr=page.getByText('Round Robin',{exact:true});const n=await rr.count();if(n){await rr.first().click();await page.waitForTimeout(8000);}
await page.screenshot({path:R+'zd-az-3.png'});const t=await page.innerText('body');return 'rr:'+n+' '+page.url()+'\n'+t.slice(t.indexOf('PERSONALIZATION')).slice(0,3500);}
