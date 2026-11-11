module.exports = async ({ page, api, log, shot }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil:'domcontentloaded' }); await page.waitForTimeout(20000);
  await shot('c-probe-leads');
  const org = await api('GET', '/crm/v8/org'); const o = JSON.parse(org.body).org?.[0]||{}; log('edition', JSON.stringify(o.license_details||{}).slice(0,300));
  const bp = await api('GET', '/crm/v8/settings/blueprints'); log('blueprints', bp.status, bp.body.slice(0,200));
  const g = await api('GET', '/crm/v8/settings/global_picklists'); log('gp', g.status, (JSON.parse(g.body).global_picklists||[]).map(x=>x.display_label).join(','));
  const cnt = await api('GET', '/crm/v8/Leads/actions/count'); log('leads count', cnt.body);
  const d = await api('GET', '/crm/v8/Deals/actions/count'); log('deals count', d.body);
  const u = await api('GET', '/crm/v8/users?type=CurrentUser'); const cu = JSON.parse(u.body).users?.[0]||{}; log('me', cu.full_name, cu.profile?.name, cu.id);
};
