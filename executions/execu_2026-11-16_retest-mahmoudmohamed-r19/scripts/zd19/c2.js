async (page) => { const z=async(m,u,b)=>page.evaluate(async([m,u,b])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'};if(b)h['Content-Type']='application/json';const r=await fetch(u,{method:m,credentials:'include',headers:h,body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,300)};},[m,u,b]);
const o={};o.ctrash=(await z('POST','/api/v1/contacts/moveToTrash',{contactIds:['1499272000000481001','1499272000000482001','1499272000000483001','1499272000000484001']})).s;
const rb=await z('GET','/api/v1/recycleBin?limit=50');o.keys=Object.keys((rb.j?.data||[])[0]||{}).join(',');o.n=(rb.j?.data||[]).length;
o.items=(rb.j?.data||[]).map(x=>x.id+':'+(x.moduleName||x.type||x.entityType||'')+':'+String(x.displayName||x.title||'').replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,50));
return o;}
