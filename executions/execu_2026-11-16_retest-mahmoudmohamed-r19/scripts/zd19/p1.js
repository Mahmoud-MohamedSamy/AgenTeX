async (page) => { if(!/desk\.zoho\.com/.test(page.url())){await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000});for(let k=0;k<40;k++){await page.waitForTimeout(1500);if(await page.evaluate(()=>/crmcsr=/.test(document.cookie)))break;}await page.waitForTimeout(3000);}
ZLIB
const o={};for(const d of ['1499272000000006907','1499272000000432293']){const r=await z('GET','/api/v1/supportPlans?departmentId='+d+'&limit=50');o['sp'+d.slice(-4)]=r.s+' '+(r.s<300?JSON.stringify((r.j?.data||[]).map(x=>({id:x.id,name:x.name||x.supportPlanName,st:x.status}))):r.t.slice(0,200));
const c=await z('GET','/api/v1/contracts?departmentId='+d+'&limit=10');o['ct'+d.slice(-4)]=c.s+' '+(c.s<300?JSON.stringify((c.j?.data||[]).map(x=>({id:x.id,name:x.contractName,sp:x.supportPlan||x.supportPlanId}))):c.t.slice(0,200));}
const a=await z('GET','/api/v1/accounts?limit=5');o.acc=a.s+' '+JSON.stringify((a.j?.data||[]).map(x=>({id:x.id,n:x.accountName})));
return o;}
