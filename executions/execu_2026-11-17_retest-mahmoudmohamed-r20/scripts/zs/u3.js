const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
module.exports=async(page,z)=>{const out=[];await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup/landing',{waitUntil:'commit',timeout:90000}).catch(e=>out.push('gotoerr'));
let t='';for(let k=0;k<60;k++){await page.waitForTimeout(1000);t=await page.innerText('body').catch(()=>'');if(/Email Templates|Templates/.test(t)&&k>10)break;}
await page.screenshot({path:R+'zs-tmp.png'});
for(const c of (process.env.CLICKS||'').split('|').filter(Boolean)){const l=page.getByText(c,{exact:true});await l.last().waitFor({timeout:60000}).catch(()=>{});out.push(c+':'+await l.count());if(await l.count()){await l.last().click().catch(()=>out.push('clickerr'));await page.waitForTimeout(12000);}}
t=await page.innerText('body').catch(()=>'');await page.screenshot({path:R+(process.env.SHOT||'zs-tmp')+'.png'});return out.join(' ')+'\n'+page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,3000);};
