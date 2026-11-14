async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const c = async (m,p,b) => { const x = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); return x.status+' '+(await x.text()).slice(0,400); };
    const r={};
    r.a1 = await c('PATCH','agents/1499272000000432003',{roleId:'1499272000000008339', associatedDepartmentIds:['1499272000000446029']});
    const g = async id => { const j = await (await fetch(B+'agents/'+id,{headers:H})).json(); return [j.name, j.roleId, j.profileId, (j.associatedDepartmentIds||[]).join('+')].join('|'); };
    r.check1 = await g('1499272000000432003'); r.check2 = await g('1499272000000432034');
    return r;
  });
}
