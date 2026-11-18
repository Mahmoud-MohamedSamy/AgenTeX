const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const out = {}; const net = []; page.on('response', r => { if (/blueprint-transitions/.test(r.url()) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status()); });
await page.goto(H + '/views/all/tickets/4ad8caa5-4f11-404c-b25b-8235103d4090', { waitUntil: 'domcontentloaded' });
await page.getByText('QA BP RT19 3036 onlyA D6 read-only ticket').first().waitFor({ timeout: 120000 }); await sleep(4000);
await page.getByRole('button', { name: 'QA onlyA', exact: true }).first().click(); await sleep(2000);
await page.screenshot({ path: RAW + 'D6-2-run-panel.png' });
await page.getByRole('button', { name: 'Run', exact: true }).last().click(); await sleep(6000);
const t = (await text()).replace(/\s+/g, ' '); out.banner = /read this ticket but not change/.test(t); const i = t.search(/Steps/); out.after = t.slice(i, i + 120);
await page.screenshot({ path: RAW + 'D6-3-after-run.png' }); out.net = net; return out;
