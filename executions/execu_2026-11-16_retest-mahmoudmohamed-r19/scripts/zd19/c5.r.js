async (page) => { if(!/desk.zoho.com/.test(page.url())){await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'commit',timeout:90000});for(let k=0;k<40;k++){await page.waitForTimeout(1500);if(await page.evaluate(()=>/crmcsr=/.test(document.cookie)))break;}await page.waitForTimeout(3000);}
const z=async(m,u,b)=>page.evaluate(async([m,u,b])=>{const c=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||'';const h={'X-ZCSRF-TOKEN':'crmcsrfparam='+c,orgId:'946801013'};if(b)h['Content-Type']='application/json';const r=await fetch(u,{method:m,credentials:'include',headers:h,body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,500)};},[m,u,b]);

const o={};const g=await z('GET','/api/v1/tickets/1499272000000483110');const cid=g.j?.contactId;
o.ct=(await z('POST','/api/v1/contracts/moveToTrash',{contractIds:['1499272000000485192']})).s;
if(o.ct>=300){const d=await z('DELETE','/api/v1/contracts/1499272000000485192');o.ctDel=d.s+' '+d.t.slice(0,150);}
o.tk=(await z('POST','/api/v1/tickets/moveToTrash',{ticketIds:['1499272000000483110']})).s;
const cs=await z('GET','/api/v1/contacts/search?lastName=QA%20RT19%20ZD&limit=10');const ids=(cs.j?.data||[]).map(c=>c.id);o.contacts=ids;if(ids.length)o.cTrash=(await z('POST','/api/v1/contacts/moveToTrash',{contactIds:ids})).s;
for(const p of ['1499272000000485162','1499272000000485177']){let r=await z('DELETE','/api/v1/supportPlans/'+p);o['sp'+p.slice(-3)]=r.s+' '+(r.s>=300?r.t.slice(0,150):'');}
const rb=await z('GET','/api/v1/recycleBin?limit=50');const all=(rb.j?.data||[]);o.bin=all.map(x=>x.type+':'+String(x.displayName).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,40));
const q=all.filter(x=>/QA RT19 ZD/.test(x.displayName)).map(x=>x.id);if(q.length){o.purge=(await z('POST','/api/v1/recycleBin/delete',{ids:q})).s;}
const a=await z('GET','/api/v1/recycleBin?limit=50');o.binAfter=(a.j?.data||[]).length;
for(const d of ['1499272000000006907','1499272000000432293']){const s=await z('GET','/api/v1/supportPlans?departmentId='+d);o['spLeft'+d.slice(-4)]=(s.j?.data||[]).length;const c=await z('GET','/api/v1/contracts?departmentId='+d);o['ctLeft'+d.slice(-4)]=(c.j?.data||[]).length;}
const t=await z('GET','/api/v1/tickets/search?subject=QA%20RT19*&limit=10');o.tLeft=(t.j?.data||[]).length;
return o;}
