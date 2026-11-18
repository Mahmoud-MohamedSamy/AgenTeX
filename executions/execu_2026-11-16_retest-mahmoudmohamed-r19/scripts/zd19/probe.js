const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
module.exports=async(page)=>{const errs=[];page.on('pageerror',e=>errs.push(String(e.message).slice(0,200)));page.on('requestfailed',r=>{if(!/accounts|iam/.test(r.url()))errs.push('FAIL '+r.failure()?.errorText+' '+r.url().slice(0,120));});
await page.reload({waitUntil:'commit'});const res=[];for(let k=0;k<12;k++){await page.waitForTimeout(10000);const t=(await page.innerText('body').catch(()=>'')).length;res.push(t);}
await page.screenshot({path:R+'zd-probe.png'});return res.join(',')+'\n'+errs.slice(0,25).join('\n');};
