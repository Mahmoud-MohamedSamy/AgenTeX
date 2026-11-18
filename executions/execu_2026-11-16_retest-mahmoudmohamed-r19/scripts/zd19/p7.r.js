async (page) => { if(!/desk.zoho.com/.test(page.url())){await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000});for(let k=0;k<40;k++){await page.waitForTimeout(1500);if(await page.evaluate(()=>/crmcsr=/.test(document.cookie)))break;}await page.waitForTimeout(3000);}
const z=async(m,u,b)=>page.evaluate(async([m,u,b])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'};if(b)h['Content-Type']='application/json';const r=await fetch(u,{method:m,credentials:'include',headers:h,body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,500)};},[m,u,b]);

const o=[];const base={name:'QA RT19 ZD Plan E',status:'ACTIVE',departmentId:'1499272000000006907',slaId:'1499272000000020033',supportType:'TICKETS'};
let cd={cycle:'MONTHLY',limit:10,isCarryForwardAllowed:false};
for(let i=0;i<8;i++){const t=await z('POST','/api/v1/supportPlans',{...base,creditDetails:cd});o.push(JSON.stringify(cd)+' => '+t.s+' '+(t.s<300?t.j.id:t.t.slice(0,220)));if(t.s<300)break;
const e=(t.j?.errors||[])[0];const m=t.j?.message||'';
if(e&&e.errorType==='missing'){const f=e.fieldName.split('/').pop();cd[f]=/allowed|is[A-Z]/.test(f)?false:/cycle/i.test(f)?'MONTHLY':10;}
else if(e&&e.errorType==='invalid'){const f=e.fieldName.split('/').pop();o.push('invalid '+f+' '+e.errorMessage);if(f==='cycle')cd.cycle=['MONTH','Monthly','MONTHS'][i%3];else break;}
else if(/extra parameter '(\w+)'/.test(m)){delete cd[m.match(/'(\w+)'/)[1]];}else break;}
return o;}
