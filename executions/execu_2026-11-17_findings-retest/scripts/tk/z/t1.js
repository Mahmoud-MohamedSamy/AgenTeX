const RAW='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/screenshots/raw/';
const M=s=>String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
module.exports=async(page,z)=>{const o={};
const r=await z('GET','/api/v1/tickets?limit=30&sortBy=-createdTime&departmentId=1499272000000006907');const L=r.j?.data||[];o.n=r.s+' '+L.length+' '+M(r.t).slice(0,200);
const withA=L.find(t=>t.assigneeId&&!/QA RT2/.test(t.subject||''));o.pick=withA&&{id:withA.id,n:withA.ticketNumber,a:withA.assigneeId,dept:withA.departmentId,subj:M(withA.subject).slice(0,40)};
const me=await z('GET','/api/v1/myinfo');o.me=me.j?.id;
if(!withA)return o;
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/'+withA.id,{waitUntil:'commit'});
for(let k=0;k<30;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(t.includes('#'+withA.ticketNumber))break;}
await page.waitForTimeout(3000);
for(let i=0;i<2;i++){const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});await page.keyboard.press('Escape');await page.waitForTimeout(600);}
await page.screenshot({path:RAW+'F13-Z-1-source.png'});
o.btns=(await page.locator('button,[role=button],[data-id],[data-title]').evaluateAll(es=>es.filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-title')||e.getAttribute('aria-label')||e.getAttribute('data-id')||e.innerText||'').trim().slice(0,30)).filter(Boolean))).slice(0,120);
return o;};
