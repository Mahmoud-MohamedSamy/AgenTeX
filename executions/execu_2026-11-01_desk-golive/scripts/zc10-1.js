async (page) => {
  for (let i=0;i<40;i++){ try{ await page.waitForTimeout(1000); if ((await page.innerText('body')).length>300) break;}catch(e){} }
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    let H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf}; const r={};
    const g = async p => { const x = await fetch(B+p,{headers:H}); return [x.status, await x.text()]; };
    let [s,t]=await g('organizations'); r.orgs=s+' '+t.slice(0,300);
    try{ const o=JSON.parse(t).data; H.orgId=String(o[0].id); r.orgId=H.orgId; r.edition=o[0].edition; }catch(e){}
    for (const p of ['departments?limit=50','agents?limit=50','roles','profiles']) { const [a,b]=await g(p); let v=b; try{ const j=JSON.parse(b); v=JSON.stringify((j.data||[]).map(x=>[x.name||x.firstName+' '+x.lastName,x.id,x.status||x.type||'',x.roleId||x.reportsTo||'',x.profileId||'',(x.associatedDepartmentIds||[]).join('+'),x.emailId?('email len '+x.emailId.length):''].join('|'))); }catch(e){} r[p]=a+' '+v.slice(0,1500); }
    return r;
  });
}
