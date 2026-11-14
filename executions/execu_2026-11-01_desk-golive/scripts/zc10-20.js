async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013','Content-Type':'application/json'};
    const c = async (m,p,b) => { const x = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); return x.status+' '+(await x.text()).slice(0,200); };
    const bin = await (await fetch(B+'recycleBin?limit=50',{headers:H})).json();
    const ids = (bin.data||[]).filter(d=>/QA C10/.test(d.displayName||'')).map(d=>d.id); const r={n:ids.length};
    for (const p of ['recycleBin/permanentDelete','recycleBin/delete','recycleBin/deleteForever']) { r[p]=await c('POST',p,{ids}); if (/^2/.test(r[p])) break; }
    r.disable = await c('POST','departments/1499272000000446029/disable',{});
    return r;
  });
}
