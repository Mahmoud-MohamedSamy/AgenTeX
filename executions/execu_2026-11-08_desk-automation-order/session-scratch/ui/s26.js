module.exports = async (h) => {
  const { page, go, shot, log } = h;
  await go('/settings/security/audit-log'); await page.waitForTimeout(4000);
  const link = page.getByRole('link', { name: 'QA AO WF N2', exact: true }).first();
  log('N5_count', await link.count()); log('N5_href', await link.getAttribute('href').catch(() => null));
  if (await link.count()) { await link.click(); await page.waitForTimeout(3500); log('N5_after', page.url()); log('N5_page', (await page.locator('main').last().innerText()).slice(0, 150)); }
  else { const t = page.getByText('QA AO WF N2', { exact: true }).first(); await t.click(); await page.waitForTimeout(3500); log('N5_afterText', page.url()); }
  await shot('s26-n5');
};
