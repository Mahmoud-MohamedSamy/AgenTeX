const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/f2ui.json'), 'utf8'));
await go('/views/all/tickets/' + M.T[0]);
await page.getByText('QA BP F2U form ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(3000);
await page.getByRole('tab', { name: /History/i }).first().click().catch(() => page.getByText('HISTORY', { exact: true }).first().click()); await sleep(5000);
const hb = (await text()).replace(/\s+/g, ' '); const j = hb.search(/Today \(Nov/); log('history text', hb.slice(j, j + 1500));
log('shows description change', /QA F2 control text change/.test(hb)); log('shows address change', /Tanta|address/i.test(hb.slice(j)));
await shot('f2-history-manual');
return { ok: true };
