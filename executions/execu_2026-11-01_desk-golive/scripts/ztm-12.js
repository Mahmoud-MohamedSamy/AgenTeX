async (page) => page.evaluate(async () => { const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1]; const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'};
  const r = await (await fetch(B+'departments/1499272000000432293/agents?limit=50',{headers:H})).json(); const r2 = await (await fetch(B+'departments/1499272000000006907/agents?limit=50',{headers:H})).json();
  return { tech: (r.data||[]).map(a=>[a.id,a.firstName||'',a.lastName||'']), main: (r2.data||[]).map(a=>[a.id,a.lastName||'']) }; })
