module.exports = async ({ page, api, log }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(15000);
  for (const id of ['7687862000000750565', '7687862000000750026']) {
    for (const p of [`/crm/v8/settings/custom_views/${id}?module=Leads`, `/crm/v2.2/settings/custom_views/${id}?module=Leads`, `/crm/v8/settings/custom_views?ids=${id}&module=Leads`]) {
      const r = await api('DELETE', p); log(id, p.replace(/\?.*/, ''), r.status, r.body.slice(0, 160)); if (r.status < 300) break; }
  }
};
