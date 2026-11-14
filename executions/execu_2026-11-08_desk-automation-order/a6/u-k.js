const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/k-made.json'), 'utf8'));
for (const [k, name] of [['K3b', 'K3b please send']]) {
  await go('/views/all/tickets/' + M.tickets[k].id);
  await page.getByText('QA BP K ' + name).first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(3000);
  await page.getByRole('tab', { name: /History/i }).first().click().catch(() => page.getByText('HISTORY', { exact: true }).first().click()); await sleep(5000);
  const hb = (await text()).replace(/\s+/g, ' '); const j = hb.search(/Today \(Nov/); log(k + ' history', hb.slice(j, j + 1100));
  await shot('k-' + k + '-history');
}
return { ok: true };
