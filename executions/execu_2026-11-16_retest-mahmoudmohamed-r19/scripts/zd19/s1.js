async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
let ok=false;for(let a=0;a<5&&!ok;a++){ if(a===0) await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/automation/directassignment',{waitUntil:'commit',timeout:90000}).catch(()=>{}); else await page.reload({waitUntil:'commit',timeout:90000}).catch(()=>{});
 for(let k=0;k<40;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(/caused an error/.test(t))break;if(/DATA ADMINISTRATION/i.test(t)&&/\nImport\n/.test(t)){ok=true;break;}}}
if(!ok)return 'menu not loaded';
await page.waitForTimeout(3000);const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});
await page.getByText('Import',{exact:true}).first().click();
for(let k=0;k<40;k++){await page.waitForTimeout(2000);if(await page.getByText('New Import',{exact:true}).count())break;}
await page.waitForTimeout(3000);await page.getByText('New Import',{exact:true}).last().click();await page.waitForTimeout(12000);
await page.screenshot({path:R+'zd-imp-a.png'});const t=await page.innerText('body');return t.slice(t.indexOf('Data Administration')).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
