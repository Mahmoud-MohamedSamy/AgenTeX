const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
module.exports=async(page,z)=>{const out=[];const H=process.env.H||'';await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#'+H,{waitUntil:'commit',timeout:90000}).catch(e=>out.push('gotoerr'));
const re=new RegExp(process.env.UNTIL||'Channels','i');let t='';for(let k=0;k<90;k++){await page.waitForTimeout(1000);t=await page.innerText('body').catch(()=>'');if(re.test(t)&&k>8)break;}await page.waitForTimeout(4000);
for(const c of (process.env.CLICKS||'').split('|').filter(Boolean)){const l=page.getByText(c,{exact:true});await l.last().waitFor({timeout:60000}).catch(()=>{});out.push(c+':'+await l.count());if(await l.count()){await l.last().click().catch(()=>out.push('clickerr'));await page.waitForTimeout(+(process.env.WAIT||10000));}}
t=await page.innerText('body').catch(()=>'');await page.screenshot({path:R+(process.env.SHOT||'zs-tmp')+'.png',fullPage:!!process.env.FULL});
const links=process.env.LINKS?await page.evaluate(()=>[...document.querySelectorAll('a[href*="#setup"]')].map(a=>a.innerText.trim().slice(0,40)+' => '+a.getAttribute('href'))):[];
return out.join(' ')+'\n'+page.url()+'\n'+t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,+(process.env.LEN||3000))+'\n'+links.join('\n');};
