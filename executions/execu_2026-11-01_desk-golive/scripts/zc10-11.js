async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const c = async (m,p,b) => { const x = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); const t=await x.text(); try{const j=JSON.parse(t); return j.errorCode? x.status+' '+t.slice(0,300) : [x.status,j.id,j.ticketNumber,j.assigneeId,j.departmentId,j.contactId].join('|');}catch(e){return x.status+' '+t.slice(0,200)} };
    const D='1499272000000446029';
    return { t1: await c('POST','tickets',{subject:'QA C10 owned by agent 1', departmentId:D, assigneeId:'1499272000000432003', contact:{lastName:'QA C10 contact', email:'qa-c10-contact@example.com'}, description:'QA C10 private sharing test'}),
             t2: await c('POST','tickets',{subject:'QA C10 owned by owner (control)', departmentId:D, assigneeId:'1499272000000139001', contact:{lastName:'QA C10 contact', email:'qa-c10-contact@example.com'}, description:'QA C10 control'}) };
  });
}
