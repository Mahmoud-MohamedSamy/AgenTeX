module.exports = async ({ page, api, gotoReady, log, shot }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/tab/Leads', /Leads/);
  const g = await api('GET', '/crm/v8/settings/global_picklists'); const gp = JSON.parse(g.body).global_picklists; log('gp count', gp.length, gp.filter(x=>x.customizable!==false).map(x=>x.display_label+'|'+x.id));
  const bp = await api('GET', '/crm/v8/settings/blueprints'); log('blueprints', bp.status, bp.body.slice(0,300));
  const ps = await api('GET', '/crm/v8/settings/pipeline?layout_id=x'); log('pipeline', ps.status, ps.body.slice(0,150));
  for (const u of ['https://crm.zoho.com/crm/org943261092/settings/global-picklist','https://crm.zoho.com/crm/org943261092/settings/blueprint']) {
    await page.goto(u, { waitUntil:'domcontentloaded' }); await page.waitForTimeout(15000);
    log(u.split('/').pop(), (await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,500)); await shot('probe-'+u.split('/').pop());
  }
};
