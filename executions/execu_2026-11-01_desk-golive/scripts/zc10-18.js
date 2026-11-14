async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const c = async (m,p,b) => { const x = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); return x.status+' '+(await x.text()).slice(0,200); };
    const r={};
    r.trashT = await c('POST','tickets/moveToTrash',{ticketIds:['1499272000000451038','1499272000000451083']});
    r.trashC = await c('POST','contacts/moveToTrash',{contactIds:['1499272000000451001']});
    r.a1 = await c('PATCH','agents/1499272000000432003',{rolePermissionType:'AgentPublic', roleId:'1499272000000008337', profileId:'1499272000000008345', associatedDepartmentIds:['1499272000000006907']});
    r.a2 = await c('PATCH','agents/1499272000000432034',{rolePermissionType:'AgentPublic', roleId:'1499272000000008337', profileId:'1499272000000008345', associatedDepartmentIds:['1499272000000006907']});
    r.bin = await c('GET','recycleBin?limit=20');
    return r;
  });
}
