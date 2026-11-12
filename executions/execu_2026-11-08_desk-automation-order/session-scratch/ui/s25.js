const NL = String.fromCharCode(10);
const T = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-08_desk-automation-order/a4/n2.json', 'utf8'));
module.exports = async (h) => {
  const { page, go, shot, log } = h;
  await go('/views/all/tickets/' + T.ticket); await page.waitForTimeout(5000);
  log('tabs', (await page.getByRole('tab').allInnerTexts()).map(t => t.trim()));
  for (const name of [/History/i, /Activit/i, /Tasks?/i]) {
    const tab = page.getByRole('tab', { name }).first();
    if (!(await tab.count())) continue;
    await tab.click(); await page.waitForTimeout(2500);
    log('tab_' + String(name), (await page.locator('main').last().innerText()).split(NL).filter(l => /department|Department|Workflow|rule|task|QA AO WF|System/i.test(l)).slice(0, 14));
    await shot('s25-' + String(name).replace(/\W/g, ''), { full: true });
  }
  // N5: audit log via the setup sidebar
  await go('/settings/automation/workflow-rules'); await page.waitForTimeout(2500);
  await page.getByRole('link', { name: 'Audit Log' }).first().click().catch(() => page.getByText('Audit Log', { exact: true }).first().click());
  await page.waitForTimeout(4000); log('N5_url', page.url());
  const row = page.locator('tbody tr, [role=row]').filter({ hasText: /QA AO WF N2|workflow/i }).first();
  log('N5_row', (await row.innerText().catch(() => 'none')).replace(/\s+/g, ' ').slice(0, 300));
  const a = row.locator('a').first(); log('N5_links', await row.locator('a').count());
  if (await a.count()) { await a.click(); await page.waitForTimeout(3000); log('N5_after', page.url()); }
  else { await row.click().catch(() => {}); await page.waitForTimeout(2000); log('N5_afterRowClick', { url: page.url(), panel: (await page.locator('[role=dialog], aside').first().innerText().catch(() => '')).slice(0, 300) }); }
  await shot('s25-n5', { full: true });
};
