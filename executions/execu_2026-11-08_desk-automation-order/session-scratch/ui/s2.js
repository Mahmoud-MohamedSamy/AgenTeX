module.exports = async ({ page, go, shot, log }) => {
  const t0 = Date.now(); await go('/settings/automation/workflow-rules');
  await page.getByRole('row').nth(3).waitFor({ timeout: 30000 }); log('O11_loadMs', Date.now() - t0);
  log('inputs', await page.$$eval('input,select,button[role=combobox],[role=combobox]', els => els.map(e => [e.tagName, e.getAttribute('placeholder'), e.getAttribute('aria-label'), (e.innerText || '').slice(0, 30)].join('|'))));
  log('headers', await page.$$eval('th', t => t.map(x => x.innerText.trim())));
  log('rowCount', await page.getByRole('row').count());
  log('triggerSamples', await page.$$eval('tbody tr', rs => [...new Set(rs.map(r => r.children[4] && r.children[4].innerText.trim()))].slice(0, 25)));
  await shot('s2-list');
};
