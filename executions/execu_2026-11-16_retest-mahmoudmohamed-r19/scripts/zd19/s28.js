async (page) => { const z=async(m,u)=>page.evaluate(async([m,u])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const r=await fetch(u,{method:m,credentials:'include',headers:{'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'}});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,300)};},[m,u]);
const s=await z('GET','/api/v1/tickets/search?subject=QA%20RT19%20ZD%20D3*&limit=10');const out=[];
for(const x of (s.j?.data||[])){const g=await z('GET','/api/v1/tickets/'+x.id);const h=await z('GET','/api/v1/tickets/'+x.id+'/History?limit=10');
out.push({id:x.id,num:g.j?.ticketNumber,subject:g.j?.subject,dept:g.j?.departmentId,assigneeId:g.j?.assigneeId,status:g.j?.status,hist:(h.j?.data||[]).map(e=>e.eventName+':'+(e.eventInfo||[]).map(i=>i.propertyName+'='+JSON.stringify(i.propertyValue)).join(';').replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,300))});}
return {s:s.s,t:s.s>=300?s.t:undefined,out};}
