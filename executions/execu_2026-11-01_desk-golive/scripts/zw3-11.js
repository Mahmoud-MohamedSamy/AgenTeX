async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techsolutionsegypt/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'944875504'};
    const out={}; for (const id of ['1475109000000008345','1475109000000008343']) { const p = await (await fetch(B+'profiles/'+id,{headers:H})).json(); out[p.name]={type:p.type, default:p.default, setup:p.permissions.setup}; }
    return out;
  });
}
