async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'};
    const th = await (await fetch(B+'tickets/1499272000000451126/threads',{headers:H})).json();
    const outs = (th.data||[]).filter(x=>x.direction==='out'); const last = outs[0];
    const d = await (await fetch(B+'tickets/1499272000000451126/threads/'+last.id,{headers:H})).json();
    const links = ((d.content||'').match(/href="([^"]+)"/g)||[]).map(h=>h.slice(6,-1)).filter(u=>/^http/.test(u) && !/static|zohocdn/.test(u));
    return { n: outs.length, links };
  });
}
