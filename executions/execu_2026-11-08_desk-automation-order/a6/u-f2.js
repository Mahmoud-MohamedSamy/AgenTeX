// F2 screen: transition form shows the ticket's current address parts? History line of an address change readable?
const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/f2ui.json'), 'utf8'));
await go('/views/all/tickets/' + M.T[0]);
await page.getByText('QA BP F2U form ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(4000);
const btn = page.getByRole('button', { name: 'QA F2 form' }).first(); log('form button', await btn.count());
if (await btn.count()) { await btn.click(); await sleep(5000); }
const inputs = await page.locator('input, textarea, select').evaluateAll(a => a.filter(x => x.offsetParent).map(x => (x.getAttribute('aria-label') || x.getAttribute('placeholder') || x.name || x.id || '') + '=' + x.value).slice(0, 40));
log('visible inputs', inputs);
const b = (await text()).replace(/\s+/g, ' '); const i = b.search(/QA BP F2 address/); log('form text', b.slice(Math.max(0, i - 200), i + 600));
await shot('f2-form');
await go('/views/all/tickets/' + M.T[1]);
await page.getByText('QA BP F2U history ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(3000);
await page.getByRole('tab', { name: /History/i }).first().click().catch(() => page.getByText('HISTORY', { exact: true }).first().click()); await sleep(4000);
for (let k = 0; k < 6; k++) { await page.mouse.move(1100, 600); await page.mouse.wheel(0, 1500); await sleep(800); }
const hb = (await text()).replace(/\s+/g, ' '); const j = hb.search(/Today \(Nov/); log('history text', hb.slice(j, j + 2500));
log('mentions address', /address|Street|Giza/i.test(hb.slice(j)));
await shot('f2-history2');
return { ok: true };
