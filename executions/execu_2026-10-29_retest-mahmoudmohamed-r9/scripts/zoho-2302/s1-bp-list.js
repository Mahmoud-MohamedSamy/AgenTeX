// Read-only: list blueprints in Setup and probe the internal API.
module.exports = async ({ page, shot, api, log }) => {
  await page.goto('https://crm.zoho.com/crm/org943261092/settings/blueprint', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(25000);
  log('URL', page.url());
  log((await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 3000));
  await shot('bp-list');
  for (const p of ['/crm/v2.2/settings/modules/Leads', '/crm/v2/settings/layouts?module=Leads', '/crm/v2.2/Leads/search?criteria=(Last_Name:starts_with:QA)']) {
    const r = await api('GET', p); log(p, r.status, r.body.slice(0, 600));
  }
};
