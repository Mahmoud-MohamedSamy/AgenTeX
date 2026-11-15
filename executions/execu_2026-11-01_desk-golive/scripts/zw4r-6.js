async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013', 'content-type':'application/json'};
    const se = await (await fetch(B+'supportEmailAddress?departmentId=1499272000000006907',{headers:H})).json(); const from = (se.data[0]||{}).address;
    const r = await fetch(B+'tickets/1499272000000451126/sendReply',{method:'POST',headers:H,body:JSON.stringify({channel:'EMAIL', to:'mmohamed@anyware.software', fromEmailAddress: from, contentType:'html', content:'<div>QA GL W4R Zoho rating link test (W4-76). رد اختبار.</div>'})});
    return { s: r.status, t: (await r.text()).slice(0, 120) };
  });
}
