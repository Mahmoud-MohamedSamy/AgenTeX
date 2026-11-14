async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const x = await fetch(B+'agents/1499272000000432034',{method:'PATCH',headers:H,body:JSON.stringify({associatedDepartmentIds:['1499272000000006907']})});
    const j = await x.json(); return x.status+' '+(j.associatedDepartmentIds||[]).join('+')+' '+(j.errorCode||'');
  });
}
