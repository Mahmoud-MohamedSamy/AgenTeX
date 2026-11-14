const M = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'executions/execu_2026-11-08_desk-automation-order/a6/zm-prep.json'), 'utf8'));
const hits = []; page.on('response', async r => { if (r.request().method() === 'GET') { const t = await r.text().catch(() => ''); if (t.includes('QA AS6 BH')) hits.push(r.url().replace(H, '') + ' ' + t.slice(0, 1500)); } });
await go('/settings/automation/blueprints/' + M.B); await sleep(9000);
await page.locator('.react-flow__node').filter({ hasText: 'Open' }).first().click(); await sleep(3000);
return { hits };
