async (page) => { if(!/desk.zoho.com/.test(page.url())){await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000});for(let k=0;k<40;k++){await page.waitForTimeout(1500);if(await page.evaluate(()=>/crmcsr=/.test(document.cookie)))break;}await page.waitForTimeout(3000);}
const z=async(m,u,b)=>page.evaluate(async([m,u,b])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'};if(b)h['Content-Type']='application/json';const r=await fetch(u,{method:m,credentials:'include',headers:h,body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,500)};},[m,u,b]);

const o=[];const base={name:'QA RT19 ZD Plan E',status:'ACTIVE',departmentId:'1499272000000006907',slaId:'1499272000000020033',supportType:'TICKETS'};
const f={isCarryForwardAllowed:false,isAdditionalUsageAllowed:false};
const vars=[{creditCycle:'MONTHLY',creditLimit:10},{creditCycle:'MONTHLY',credits:10},{creditCycle:'MONTHLY',creditCount:10},{renewalCycle:'MONTHLY',creditLimit:10},{creditCycle:'MONTHLY'},{creditLimit:10},{supportCredits:10,creditCycle:'MONTHLY'}];
for(const v of vars){const t=await z('POST','/api/v1/supportPlans',{...base,creditDetails:{...f,...v}});o.push(JSON.stringify(v)+' => '+t.s+' '+(t.s<300?t.j.id:t.t.slice(0,220)));if(t.s<300)break;}
return o;}
