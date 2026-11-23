const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
module.exports=async(page)=>{let ok=false;for(let a=0;a<4&&!ok;a++){if(a>0)await page.reload({waitUntil:'commit'}).catch(()=>{});
for(let k=0;k<30;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(/All Tickets/.test(t)){ok=true;break;}}}
await page.waitForTimeout(3000);const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});
await page.getByText('Contracts',{exact:true}).first().click({timeout:15000}).catch(e=>console.log('noclick'));
let t='';for(let k=0;k<40;k++){await page.waitForTimeout(2000);t=await page.innerText('body');if(/QA RT20 ZC C1/.test(t))break;}
await page.waitForTimeout(2000);await page.screenshot({path:R+'ZC-2841-0-list.png'});
await page.getByText('QA RT20 ZC C1').first().click({timeout:15000});for(let k=0;k<20;k++){await page.waitForTimeout(1500);t=await page.innerText('body');if(/Plan A/.test(t))break;}
await page.waitForTimeout(2500);await page.screenshot({path:R+'ZC-2841-1-detail.png'});
return ok+' '+page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2500);};
