async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
let ok=false;for(let a=0;a<4&&!ok;a++){if(a===0)await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/contracts',{waitUntil:'commit',timeout:90000}).catch(()=>{});else await page.reload({waitUntil:'commit'}).catch(()=>{});
for(let k=0;k<30;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(/caused an error/.test(t))break;if(/Contract/i.test(t)&&t.length>400){ok=true;break;}}}
await page.waitForTimeout(4000);const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});
await page.screenshot({path:R+'zd-c-1.png'});const t=await page.innerText('body');return ok+' '+page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1500);}
