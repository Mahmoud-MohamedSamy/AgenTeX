const EV = JSON.parse(require('fs').readFileSync(require('path').resolve('../evidence/plane-evidence2.json'), 'utf8'));
await go('/views/all/tickets/' + EV.en13.ticket);
await page.getByText('Steps', { exact: true }).first().waitFor({ timeout: 60000 }).catch(() => {}); await sleep(3000); await shot('EW-EN13-ticket');
const ht = page.getByRole('tab', { name: /History/i }).first(); await ht.click({ timeout: 15000 }).catch(() => {}); await sleep(5000); await shot('EW-EN13-history');
const t = await text(); return { statusLines: t.split('\n').filter(x => /Status|Escalated|Entered/i.test(x)).slice(0, 12) };
