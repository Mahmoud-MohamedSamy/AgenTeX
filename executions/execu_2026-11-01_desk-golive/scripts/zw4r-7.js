async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013', 'content-type':'application/json'}; const out={};
    const s = await fetch(B+'contacts/search?email=mmohamed@anyware.software',{headers:H}); out.search = s.status + ' ' + (s.status===200 ? (await s.json()).data.map(c=>c.id+' '+c.lastName).join(',') : '');
    return out;
  });
}
