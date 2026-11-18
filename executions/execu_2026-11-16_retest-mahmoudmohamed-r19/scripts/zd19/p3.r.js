async (page) => { if(!/desk.zoho.com/.test(page.url())){await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000});for(let k=0;k<40;k++){await page.waitForTimeout(1500);if(await page.evaluate(()=>/crmcsr=/.test(document.cookie)))break;}await page.waitForTimeout(3000);}
const z=async(m,u,b)=>page.evaluate(async([m,u,b])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'};if(b)h['Content-Type']='application/json';const r=await fetch(u,{method:m,credentials:'include',headers:h,body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,500)};},[m,u,b]);

const out=[];let body={name:'QA RT19 ZD Plan E',status:'ACTIVE',departmentId:'1499272000000006907'};
for(let i=0;i<8;i++){const t=await z('POST','/api/v1/supportPlans',body);out.push(JSON.stringify(body)+' => '+t.s+' '+t.t.slice(0,260));if(t.s<300)break;
const e=(t.j?.errors||[])[0];const m=t.j?.message||'';if(e&&e.errorType==='missing'){const f=e.fieldName.replace('/','');body[f]={supportType:'TICKET_BASED',supportPlanType:'TICKET_BASED',type:'TICKET_BASED'}[f]||(f.endsWith('Id')?'0':'x');}else if(/extra parameter '(\w+)'/.test(m)){delete body[m.match(/'(\w+)'/)[1]];}else break;}
return out;}
