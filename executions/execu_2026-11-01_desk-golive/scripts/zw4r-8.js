async (page) => {
  const out = {};
  out.patch = await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013', 'content-type':'application/json'};
    const r = await fetch(B+'contacts/1499272000000449797',{method:'PATCH',headers:H,body:JSON.stringify({email:'mmohamed@anyware.software'})}); const r2 = await fetch(B+'tickets/1499272000000451126',{method:'PATCH',headers:H,body:JSON.stringify({email:'mmohamed@anyware.software'})});
    return r.status + ' / ticket ' + r2.status;
  });
  await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/1499272000000451126', { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(1500); const t = await page.innerText('body').catch(() => ''); if (/QA GL W4R/.test(t) && /Reply/.test(t)) break; }
  await page.getByRole('button', { name: 'Not Now' }).click().catch(() => {});
  await page.screenshot({ path: 'evidence/zoho-w4r/ticket.png' });
  out.btns = await page.locator('button, [role=button], a').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || e.getAttribute('data-title') || '').trim()).filter(t => /^(Reply|Reply All|Send|Customer Happiness)/i.test(t)).slice(0, 10));
  return out;
}
