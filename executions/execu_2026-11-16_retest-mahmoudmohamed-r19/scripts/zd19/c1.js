async (page) => { const z=async(m,u,b)=>page.evaluate(async([m,u,b])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'};if(b)h['Content-Type']='application/json';const r=await fetch(u,{method:m,credentials:'include',headers:h,body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,300)};},[m,u,b]);
const o={};const T=['1499272000000480038','1499272000000481038','1499272000000482038','1499272000000483038','1499272000000484038','1499272000000480073','1499272000000480111','1499272000000480155','1499272000000491001','1499272000000491037'];
const g=await z('GET','/api/v1/tickets/1499272000000480038');const cid=g.j?.contactId;o.contact=cid;
o.trash=(await z('POST','/api/v1/tickets/moveToTrash',{ticketIds:T})).s;
for(const s of ['1499272000000485010','1499272000000485020','1499272000000485040']){o['sk'+s.slice(-3)]=(await z('DELETE','/api/v1/skills/'+s)).s;}
for(const s of ['1499272000000485001','1499272000000485004']){const r=await z('DELETE','/api/v1/skillTypes/'+s);o['st'+s.slice(-3)]=r.s+' '+(r.s>=300?r.t:'');}
const srch=await z('GET','/api/v1/contacts/search?lastName=QA%20RT19%20ZD&limit=10');o.contacts=(srch.j?.data||[]).map(c=>c.id+' '+c.lastName);
if(cid){o.ctrash=(await z('POST','/api/v1/contacts/moveToTrash',{contactIds:[cid]})).s;}
const rb=await z('GET','/api/v1/recycleBin?limit=50');o.rb=rb.s+' '+(rb.j?.data||[]).map(x=>x.id+':'+x.module+':'+(x.name||x.subject||'').replace(/[\w.+-]+@[\w.-]+/g,'<email>')).join(' | ')+(rb.s>=300?rb.t:'');
return o;}
