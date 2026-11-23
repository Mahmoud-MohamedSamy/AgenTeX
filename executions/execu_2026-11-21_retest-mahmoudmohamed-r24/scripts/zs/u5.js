const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
module.exports=async(page,z)=>{const out=[];await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/'+process.env.TID,{waitUntil:'commit',timeout:90000}).catch(()=>out.push('gotoerr'));
for(let k=0;k<90;k++){await page.waitForTimeout(1000);const t=await page.innerText('body').catch(()=>'');if(/QA RT20 ZS/.test(t)&&/Reply All/.test(t)&&k>8)break;if(/caused an error/.test(t)&&k%20==19)await page.reload({waitUntil:'commit'}).catch(()=>{});}await page.waitForTimeout(4000);
const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});
const r=page.getByText(process.env.BTN||'Reply All',{exact:true});out.push('reply:'+await r.count());if(await r.count()){await r.first().click().catch(e=>out.push('clickerr'));await page.waitForTimeout(10000);}
const inputs=await page.evaluate(()=>[...document.querySelectorAll('input,textarea')].filter(e=>e.offsetParent).map(e=>(e.name||e.placeholder||e.id||e.getAttribute('aria-label')||'?')+'='+(e.value||'').slice(0,120)));
await page.screenshot({path:R+(process.env.SHOT||'zs-tmp')+'.png'});const t=(await page.innerText('body')).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
return out.join(' ')+'\n'+inputs.join('\n').replace(/[\w.+-]+@[\w.-]+/g,'<email>')+'\n----\n'+t.slice(0,2500);};
