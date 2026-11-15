async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'}; const out={};
    const g = async p => { const r = await fetch(B+p,{headers:H}); const t = await r.text(); return r.status + ' ' + t.slice(0,500); };
    for (const p of ['customerHappiness?limit=3','customerHappinessSettings','happinessSettings','settings/customerHappiness','portalLanguages','languages','helpCenters','departments?limit=10','supportEmailAddress?limit=5','contacts?limit=3','organizations/946801013']) out[p] = await g(p);
    return out;
  });
}
