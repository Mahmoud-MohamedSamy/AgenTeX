async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techsolutionsegypt/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'944875504'};
    const js = await (await fetch(B+'profiles',{headers:H})).json();
    const out = {names: js.data.map(p=>p.name+'|'+p.id+'|'+p.type)};
    const ag = js.data.find(p=>/^Agent$/i.test(p.name));
    const p = await (await fetch(B+'profiles/'+ag.id,{headers:H})).json();
    out.keys = Object.keys(p.permissions);
    for (const k of Object.keys(p.permissions)) if (/setup|admin|setting|general|automation|archiv|spam|custom|function/i.test(k)) out[k]=p.permissions[k];
    out.top = Object.keys(p).filter(k=>k!=='permissions').map(k=>k+'='+JSON.stringify(p[k]).slice(0,80));
    return out;
  });
}
