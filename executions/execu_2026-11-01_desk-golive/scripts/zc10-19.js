async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const c = async (m,p,b) => { const x = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); return x.status+' '+(await x.text()).slice(0,300); };
    const r={};
    const bin = await (await fetch(B+'recycleBin?limit=50',{headers:H})).json();
    const ids = (bin.data||[]).filter(d=>/QA C10/.test(d.displayName||'')).map(d=>d.id); r.binQA = (bin.data||[]).map(d=>d.type+':'+d.displayName).join(' ; ');
    r.purge = await c('POST','recycleBin/deletePermanently',{ids});
    if (/^4/.test(r.purge)) r.purge2 = await c('DELETE','recycleBin?ids='+ids.join(','));
    r.deptDisable = await c('POST','departments/disable',{departmentIds:['1499272000000446029']});
    r.deptDel = await c('DELETE','departments/1499272000000446029');
    const g = async id => { const j = await (await fetch(B+'agents/'+id,{headers:H})).json(); return [j.name, j.rolePermissionType, j.roleId, j.profileId, (j.associatedDepartmentIds||[]).join('+')].join('|'); };
    r.ag1 = await g('1499272000000432003'); r.ag2 = await g('1499272000000432034');
    return r;
  });
}
