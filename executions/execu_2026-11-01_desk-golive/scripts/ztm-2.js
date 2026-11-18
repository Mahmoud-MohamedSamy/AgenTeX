async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013', 'content-type':'application/json'}; const out={};
    const call = async (m, p, b) => { const r = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); const t = await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,300)}; };
    const DEP='1499272000000006907';
    const c = await call('POST','contacts',{lastName:'QA GL TM zoho', email:'qa-gl-tm-zoho@example.com'}); out.cid = c.j && c.j.id; out.c = c.s;
    out.t = [];
    for (const n of [1,2,3]) { const t = await call('POST','tickets',{subject:'QA GL TM zoho '+n, departmentId:DEP, contactId:out.cid, channel:'Email'}); out.t.push(t.j ? [t.j.id, t.j.ticketNumber, t.j.status, t.j.assigneeId] : t.t); }
    out.depts = ((await call('GET','departments?limit=20')).j||{}).data?.map(d=>[d.id,d.name,d.isEnabled]);
    return out;
  });
}
