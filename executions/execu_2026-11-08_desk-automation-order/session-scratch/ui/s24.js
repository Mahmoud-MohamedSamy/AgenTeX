const NL = String.fromCharCode(10);
module.exports = async (h) => {
  const { page, go, shot, log } = h;
  await go('/settings/workflow-executions'); await page.waitForTimeout(4000);
  const m = page.locator('main').last();
  log('M_head', await page.$$eval('th', t => t.map(x => x.innerText.trim())));
  const rows = await page.$$eval('tbody tr', rs => rs.slice(0, 40).map(r => [...r.children].map(c => c.innerText.trim()).join(' | ')));
  log('M5_triggers', [...new Set(rows.map(r => r.split(' | ')[2]))].slice(0, 15));
  log('M_rows', rows.slice(0, 6));
  log('M7_paging', (await m.innerText()).split(NL).filter(l => /page|of \d|next|previous|showing|rows/i.test(l)).slice(-5));
  await shot('s24-exec', { full: true });
  // M6 record link
  const link = page.locator('tbody tr a').first();
  log('M6_linkText', await link.innerText().catch(() => 'no link'));
  if (await link.count()) { await link.click(); await page.waitForTimeout(3500); log('M6_url', page.url()); await shot('s24-m6'); }
  // N2 / N3: ticket history of a ticket that a rule touched
  if (/tickets\//.test(page.url())) {
    const hist = page.getByRole('tab', { name: /History|Activity/i }).first();
    if (await hist.count()) { await hist.click(); await page.waitForTimeout(2500); }
    log('N2_history', (await page.locator('main').last().innerText()).split(NL).filter(l => /Department|department|Workflow rule|rule ran|task|call/i.test(l)).slice(0, 12));
    await shot('s24-n2', { full: true });
  }
  // N5 audit link
  await go('/settings/audit-log'); await page.waitForTimeout(4000);
  if (/404|not found/i.test(await page.locator('body').innerText())) { await go('/settings/audit'); await page.waitForTimeout(3000); }
  log('N5_url', page.url());
  const wf = page.locator('tbody tr').filter({ hasText: /workflow|QA AO WF/i }).first();
  log('N5_row', await wf.innerText().catch(() => 'none'));
  const a = wf.locator('a').first();
  if (await a.count()) { await a.click(); await page.waitForTimeout(3000); log('N5_after', page.url()); }
  await shot('s24-n5');
};
