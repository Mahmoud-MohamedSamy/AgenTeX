module.exports = async ({ page, api, log, shot }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil:'commit', timeout:90000 }).catch(()=>{});
  await page.waitForTimeout(25000); await shot('c-probe2');
  log('url', page.url());
  const u = await api('GET', '/crm/v8/users?type=CurrentUser'); const cu = JSON.parse(u.body).users?.[0]||{}; log('me', u.status, cu.full_name, cu.profile?.name, cu.role?.name, cu.status);
  const c = await api('GET', '/crm/v8/Leads/actions/count'); log('count', c.status, c.body);
};
