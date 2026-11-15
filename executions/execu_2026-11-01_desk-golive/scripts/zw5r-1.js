async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'}; const out={};
    const g = async p => { const r = await fetch(B+p,{headers:H}); let j=null; try{ j=await r.json(); }catch(e){} return {s:r.status, j}; };
    const f = await g('organizationFields?module=accounts'); out.accFieldsStatus=f.s; out.accFields = (f.j&&f.j.data||[]).map(x=>x.apiName+':'+x.displayLabel+':'+x.type);
    const l = await g('layouts?module=accounts'); out.layouts = l.s + ' ' + JSON.stringify(l.j).slice(0,200);
    const pr = await g('profiles'); out.profiles = (pr.j&&pr.j.data||[]).map(p=>p.id+' '+p.name+' '+p.type);
    const ag = (pr.j&&pr.j.data||[]).find(p=>p.name==='Agent');
    if (ag) { const d = await g('profiles/'+ag.id); out.agentKeys = Object.keys(d.j&&d.j.permissions||{}).join(','); out.agentProducts = d.j && d.j.permissions && (d.j.permissions.products || d.j.permissions.Products); out.agentAccounts = d.j && d.j.permissions && d.j.permissions.accounts; }
    return out;
  });
}
