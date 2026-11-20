const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
module.exports=async(page)=>{const o=[];for(let k=0;k<12;k++){await page.waitForTimeout(5000);const t=await page.innerText('body').catch(()=>'');o.push(k+' len='+t.length+' '+t.replace(/\s+/g,' ').replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,120));if(/QA RT20 ZC C1/.test(t))break;}
await page.screenshot({path:R+'ZC-2841-0-list.png'});return page.url()+'\n'+o.join('\n');};
