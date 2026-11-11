async (page) => page.evaluate(async () => { const __z = async (m, u, body) => { const c = (document.cookie.match(/crmcsr=([^;]+)/)||[])[1]||""; const r = await fetch(u,{method:m,credentials:"include",headers:{orgId:"944875504","Content-Type":"application/json","X-ZCSRF-TOKEN":"crmcsrfparam="+c},body:body?JSON.stringify(body):undefined}); const t = await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,600)}; };
const s = await __z('GET','/api/v1/tickets/search?subject=QA%20RT15*&limit=100&departmentId=1475109000000426945');
let ids = (s.j?.data||[]).filter(t=>/^QA RT15 (2823|2794)/.test(t.subject)).map(t=>t.id);
if (ids.length < 53) { const l = await __z('GET','/api/v1/tickets?limit=100&departmentId=1475109000000426945&fields=subject'); ids = (l.j?.data||[]).filter(t=>/^QA RT15 (2823|2794)/.test(t.subject)).map(t=>t.id); }
const out = { found: ids.length, res: [] };
for (let i=0;i<ids.length;i+=50) { const r = await __z('POST','/api/v1/tickets/moveToTrash',{ticketIds: ids.slice(i,i+50)}); out.res.push(r.s+' '+r.t.slice(0,150)); }
const c = await __z('POST','/api/v1/contacts/moveToTrash',{contactIds:['1475109000000541087']}); out.contact = c.s+' '+c.t.slice(0,150);
const after = await __z('GET','/api/v1/tickets?limit=100&departmentId=1475109000000426945&fields=subject'); out.left = (after.j?.data||[]).filter(t=>/^QA RT15/.test(t.subject)).length + ' QA left of ' + (after.j?.data||[]).length;
return out;
 })