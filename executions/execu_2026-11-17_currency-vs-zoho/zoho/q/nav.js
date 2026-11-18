async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const steps = [];
  const g = page.locator('[aria-label="Setup"], [data-zcqa="setup"], #setup_icon, [title="Setup"]');
  steps.push('gear ' + await g.count());
  if (await g.count()) await g.first().click(); else await page.goto('https://crm.zoho.com/crm/org946877290/settings', { waitUntil: 'commit' });
  for (let k = 0; k < 30; k++) { await page.waitForTimeout(2000); if (await page.getByText('Company Settings', { exact: true }).count()) break; }
  await page.getByText('Company Settings', { exact: true }).first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.getByText('Currencies', { exact: true }).count()) break; }
  await page.getByText('Currencies', { exact: true }).first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); const t = await page.innerText('body'); if (/Home Currency/i.test(t)) break; }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z01-currencies.png' });
  const t = await page.innerText('body'); const i = t.indexOf('Currencies');
  return { steps, url: page.url(), text: t.slice(t.indexOf('Fiscal Year') >= 0 ? t.indexOf('Fiscal Year') : 0).slice(0, 4000) };
}
