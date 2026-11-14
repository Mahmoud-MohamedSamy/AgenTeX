async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techsolutionsegypt/api/v1/'; const D='1475109000000426945'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'944875504'}; const r={};
    const g = async p => { const x = await fetch(B+p,{headers:H}); return x.status+' '+(await x.text()).slice(0,900); };
    for (const p of ['supportPlans?departmentId='+D,'supportPlans?departmentId='+D+'&status=active','supportPlans?departmentId='+D+'&status=inactive','customFunctions?departmentId='+D+'&limit=20','customFunctions?departmentId='+D+'&limit=20&module=tickets','departments?limit=20']) r[p]=await g(p);
    return r;
  });
}
