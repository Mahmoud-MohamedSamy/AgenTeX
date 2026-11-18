const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
module.exports=async(page,z)=>{const out=[];for(const p of (process.env.PATHS||'').split(',')){await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup/'+p,{waitUntil:'commit',timeout:90000}).catch(e=>out.push('gotoerr'));
let t='';for(let k=0;k<60;k++){await page.waitForTimeout(1000);t=await page.innerText('body').catch(()=>'');if(t.length>800&&k>12)break;}
await page.screenshot({path:R+'zs-tmp-'+p.replace(/\W/g,'_')+'.png'});out.push('### '+p+' -> '+page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1800));}return out.join('\n');};
