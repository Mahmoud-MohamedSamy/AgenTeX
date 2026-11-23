const fs = require('fs'); const J = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/bp/3065.json', 'utf8'));
const out = {}; const net = []; page.on('response', r => { if (/blueprint-transitions/.test(r.url()) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status()); });
// role case: view-only member, ticket owned by owner (#4806)
await page.goto(H + '/views/all/tickets/' + J.r2, { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 BP 3065 role T2').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
let t = (await text()).replace(/\s+/g, ' '); out.r2banner = (t.match(/You can read this ticket[^.]*\./) || ['NO'])[0]; out.r2btn = await page.getByRole('button', { name: /^QA (onlyA|shared)$/ }).count();
let i = t.search(/Steps/); out.r2steps = t.slice(i, i + 140); await shot('3065-1-viewonly-4806.png');
// per-ticket case (#4808, CS, owned by owner)
await page.goto(H + '/views/all/tickets/' + J.k1, { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 BP 3065 tk K1').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
t = (await text()).replace(/\s+/g, ' '); out.k1banner = (t.match(/You can read this ticket[^.]*\./) || ['NO'])[0]; const b = page.getByRole('button', { name: 'QA onlyA', exact: true }).first(); out.k1btn = await b.count();
i = t.search(/Steps/); out.k1steps = t.slice(i, i + 140); await shot('3065-2-readonly-4808-before.png');
if (out.k1btn) { await b.click(); await sleep(2000); await shot('3065-3-readonly-4808-run-panel.png'); const run = page.getByRole('button', { name: 'Run', exact: true }).last(); if (await run.count()) { await run.click(); await sleep(7000); } }
t = (await text()).replace(/\s+/g, ' '); out.after = t.slice(0, 50) + ' ... ' + (t.match(/This ticket is not available[^.]*|Permission denied\.?/g) || []).join(' / '); i = t.search(/Steps/); out.k1stepsAfter = t.slice(i, i + 140);
await shot('3065-4-readonly-4808-after-run.png');
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(9000); t = (await text()).replace(/\s+/g, ' '); out.reload = (t.match(/This ticket is not available[^.]*|Permission denied\.?|QA RT20 BP 3065 tk K1[^#]{0,40}/g) || []).slice(0, 3).join(' / ');
await shot('3065-5-readonly-4808-reload.png');
out.net = net; return out;
