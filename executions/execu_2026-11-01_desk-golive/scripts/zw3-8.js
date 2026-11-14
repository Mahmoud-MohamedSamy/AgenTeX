async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techsolutionsegypt/api/v1/'; const D='1475109000000426945'; const r={};
    const csrf = (document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'944875504'};
    const g = async p => { const x = await fetch(B+p,{headers:H}); return [x.status, await x.text()]; };
    let [s,t] = await g('profiles'); r.profiles = s+' '+t.slice(0,1500);
    try { const js = JSON.parse(t); const ag = (js.data||[]).find(p=>/^Agent$/i.test(p.name)) || (js.data||[])[1]; if (ag) { const [s2,t2]=await g('profiles/'+ag.id); r.agent = s2+' '+t2.slice(0,6000); } } catch(e){ r.e=e.message; }
    for (const p of ['supportPlans?departmentId='+D,'supportPlans?departmentId='+D+'&status=ACTIVE','customFunctions?departmentId='+D+'&limit=20']) { const [a,b]=await g(p); r[p]=a+' '+b.slice(0,800); }
    return r;
  });
}
