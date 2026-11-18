async (page) => { if(!/desk.zoho.com/.test(page.url())){await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000});for(let k=0;k<40;k++){await page.waitForTimeout(1500);if(await page.evaluate(()=>/crmcsr=/.test(document.cookie)))break;}await page.waitForTimeout(3000);}
const z=async(m,u,b)=>page.evaluate(async([m,u,b])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'};if(b)h['Content-Type']='application/json';const r=await fetch(u,{method:m,credentials:'include',headers:h,body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,500)};},[m,u,b]);

const o={};for(const d of ['1499272000000006907','1499272000000432293']){const r=await z('GET','/api/v1/slas?departmentId='+d);o['sla'+d.slice(-4)]=r.s+' '+(r.s<300?JSON.stringify((r.j?.data||[]).map(x=>({id:x.id,name:x.name,st:x.status}))):r.t.slice(0,200));}
const t=await z('POST','/api/v1/supportPlans',{name:'QA RT19 ZD probe'});o.spPost=t.s+' '+t.t.slice(0,300);
return o;}
