async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const c = async (m,p,b) => { const x = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); return x.status+' '+(await x.text()).slice(0,500); };
    const A1='1499272000000432003', OWN='1499272000000139001';
    const r={};
    r.dept = await c('POST','departments',{name:'QA C10 Marketing', nameInCustomerPortal:'QA C10 Marketing', isVisibleInCustomerPortal:false, associatedAgentIds:[OWN,A1]});
    return r;
  });
}
