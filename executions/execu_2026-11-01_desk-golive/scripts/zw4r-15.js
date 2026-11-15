async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013', 'content-type':'application/json'}; const out={};
    const c = async (m,p,b) => { const r = await fetch(B+p,{method:m,headers:H,body:b?JSON.stringify(b):undefined}); return r.status + ' ' + (await r.text()).slice(0,150); };
    out.t = await c('POST','tickets/moveToTrash',{ticketIds:['1499272000000451126']});
    out.c = await c('POST','contacts/moveToTrash',{contactIds:['1499272000000449797']});
    await new Promise(z=>setTimeout(z,4000));
    const rb = await (await fetch(B+'recycleBin?limit=50',{headers:H})).json(); const items = (rb.data||[]);
    const mine = items.filter(x => /QA GL W4R/.test(x.name||x.displayName||x.subject||'') || ['1499272000000451126','1499272000000449797'].includes(String(x.entityId||x.id)));
    out.binAll = items.length; out.mine = mine.map(x=>[x.id, x.name||x.displayName||x.subject, x.module||x.type]);
    if (mine.length) out.purge = await c('POST','recycleBin/delete',{ids: mine.map(x=>x.id)});
    out.tGet = (await fetch(B+'tickets/1499272000000451126',{headers:H})).status; out.cGet = (await fetch(B+'contacts/1499272000000449797',{headers:H})).status;
    return out;
  });
}
