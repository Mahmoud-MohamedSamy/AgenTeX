const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/f2d.json'), 'utf8'));
await go('/views/all/tickets/' + M.T);
await page.getByText('QA BP F2D control ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(3000);
await page.getByRole('tab', { name: /History/i }).first().click().catch(() => page.getByText('HISTORY', { exact: true }).first().click()); await sleep(5000);
const hb = (await text()).replace(/\s+/g, ' '); const j = hb.search(/Today \(Nov/); log('history text', hb.slice(j, j + 1200));
log('shows blueprint description change', /QA F2D set by blueprint/.test(hb));
await shot('f2d-history');
return { ok: true };
