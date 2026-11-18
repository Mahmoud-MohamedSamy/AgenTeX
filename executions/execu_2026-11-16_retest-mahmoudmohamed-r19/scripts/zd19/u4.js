async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
let ok=false;for(let a=0;a<4&&!ok;a++){if(a===0)await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000}).catch(()=>{});else await page.reload({waitUntil:'commit'}).catch(()=>{});
for(let k=0;k<30;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(/caused an error/.test(t))break;if(/All Tickets/.test(t)){ok=true;break;}}}
await page.waitForTimeout(3000);const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});
await page.getByText('Contracts',{exact:true}).first().click();
let t='';for(let k=0;k<40;k++){await page.waitForTimeout(2000);t=await page.innerText('body');if(/Contract/i.test(t.slice(300))&&!/cannot be found/.test(t))break;}
await page.waitForTimeout(4000);await page.screenshot({path:R+'zd-c-1.png'});t=await page.innerText('body');return ok+' '+page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1500);}
