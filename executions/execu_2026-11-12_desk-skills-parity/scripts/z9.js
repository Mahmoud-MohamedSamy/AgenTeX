async (page) => { await page.locator('text=Not Now').first().click().catch(()=>{});
 return await page.evaluate(async () => {
  const csrf = (document.cookie.match(/(?:^|; )(crmcsr|CSRF_TOKEN|_zcsr_tmp)=([^;]+)/)||[])[2];
  const out = {cookieNames: document.cookie.split('; ').map(c=>c.split('=')[0])};
  for (const u of ['/supportapi/zd/techsolutionsegypt/api/v1/departments?limit=10','/supportapi/zd/techsolutionsegypt/api/v1/skillConfiguration','/api/v1/departments?limit=5']) {
    const r = await fetch(u, { headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '944875504' } }); out[u] = [r.status, (await r.text()).slice(0, 600)]; }
  return out; }); }
