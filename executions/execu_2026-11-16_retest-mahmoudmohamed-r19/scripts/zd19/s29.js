async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const out=[];for(const [id,shot] of [['1499272000000491001','ZD-3-7'],['1499272000000491037','ZD-3-8']]){
let ok=false;for(let a=0;a<4&&!ok;a++){if(a===0)await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/'+id+'/history',{waitUntil:'commit',timeout:90000}).catch(()=>{});else await page.reload({waitUntil:'commit'}).catch(()=>{});
for(let k=0;k<30;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(/caused an error/.test(t))break;if(/Ticket Owner/.test(t)&&/QA RT19 ZD D3/.test(t)){ok=true;break;}}}
await page.waitForTimeout(3000);const h=page.getByText(/^history$/i);if(await h.count()){await h.first().click().catch(()=>{});await page.waitForTimeout(6000);}
await page.screenshot({path:R+shot+'.png'});out.push(id+' ok='+ok);}
return out.join('\n');}
