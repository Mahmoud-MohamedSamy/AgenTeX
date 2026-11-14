async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const c = async (m,p,b) => { const x = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); const t=await x.text(); let j; try{j=JSON.parse(t)}catch(e){return x.status+' '+t.slice(0,300)} return x.status+' '+(j.errorCode? t.slice(0,300) : [j.rolePermissionType,j.roleId].join('|')); };
    const r={};
    r.a2before = await c('GET','agents/1499272000000432034');
    r.a1 = await c('PATCH','agents/1499272000000432003',{rolePermissionType:'Custom', roleId:'1499272000000008339', profileId:'1499272000000008345'});
    r.a2 = await c('PATCH','agents/1499272000000432034',{rolePermissionType:'Custom', roleId:'1499272000000008337', profileId:'1499272000000008345'});
    return r;
  });
}
